import qualified Data.Map as M
import Data.Maybe (maybe)
import Data.List (intercalate)

data Machine = Maskin String deriving (Show, Ord, Eq)
data Production = Production { getMachine :: Machine, getTemp :: Int, getWater :: Int, getCO2 :: Int } deriving (Show, Eq)

splitOn :: Char -> String -> [String]
splitOn c = splitOn' []
  where splitOn' acc [] = reverse acc
        splitOn' acc xs = let (w, rest) = break (== c) xs
                          in  splitOn' (w : acc) (drop 1 rest)

parseData :: String -> [Production]
parseData = map parseLine . lines
  where parseLine :: String -> Production
        parseLine line = let [machine, temp, water, co2] = splitOn ',' line
                             ("Maskin":machineName) = splitOn ' ' machine
                             ["","temperatur", tempStr] = splitOn ' ' temp
                             ["","vann", waterStr] = splitOn ' ' water
                             ["","kullsyre", co2Str] = splitOn ' ' co2
                         in  Production {
                                 getMachine = Maskin (intercalate " "machineName),
                                 getTemp = read . init $ tempStr,
                                 getWater = read . init $ waterStr,
                                 getCO2 = read . init $ co2Str
                              }

produce :: Production -> Int
produce prod
  | getTemp prod < 95    = 0
  | getTemp prod > 105   = 0
  | getWater prod < 400  = 0
  | getWater prod > 1500 = 0
  | getCO2 prod < 300    = 0
  | getCO2 prod > 500    = 0
  | otherwise            = produce' prod
  where produce' :: Production -> Int
        produce' prod = let produced = (getWater prod) - 100 + (getCO2 prod `div` 10)
                            heatLosses = if getTemp prod >= 100 then produced `div` 40 else 0
                        in  produced - heatLosses

produceAll :: [Production] -> M.Map Machine Int
produceAll = foldr foldFn M.empty
  where foldFn :: Production -> M.Map Machine Int -> M.Map Machine Int
        foldFn prod m = let produced = produce prod
                        in  M.alter (Just . maybe produced (+ produced)) (getMachine prod) m

maxEntry :: Ord k => M.Map k Int -> Maybe (k, Int)
maxEntry = M.foldrWithKey (\k v acc -> case acc of
    Nothing -> Just (k, v)
    Just (_, mv) -> if v > mv then Just (k, v) else acc) Nothing

main = do
  productions <- parseData <$> readFile "julebrusmaskiner.txt"

  let totalProductionMap = produceAll productions
      Just (Maskin machineName) = fmap fst . maxEntry $ totalProductionMap
      totalProduction = sum totalProductionMap

  print (show totalProduction ++ " " ++ machineName)

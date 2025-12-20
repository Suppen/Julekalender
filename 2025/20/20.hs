import qualified Data.Map as M
import Data.Maybe (isJust)
import Data.List (sortOn, find, intercalate)

data Item = Item { getName :: String, getPrice :: Int, getWeight :: Double, getSugar :: Int, getMaxWeight :: Int, getMinBoxes :: Int } deriving (Show, Eq)

type ItemMap = M.Map String Item
type ShoppingCart = M.Map String Int

getSugarPriceRatio :: Item -> Double
getSugarPriceRatio item =
  let sugarPerBox = getWeight item * ((fromIntegral $ getSugar item) / 100)
  in  sugarPerBox / (fromIntegral $ getPrice item)

getMaxBoxes :: Item -> Int
getMaxBoxes item = floor $ fromIntegral (getMaxWeight item) / getWeight item

splitOn :: Char -> String -> [String]
splitOn c = splitOn' []
  where splitOn' acc [] = reverse acc
        splitOn' acc xs = let (w, rest) = break (== c) xs
                          in  splitOn' (w : acc) (drop 1 rest)

parseInput :: String -> ([String], ItemMap)
parseInput input = (itemNames, itemMap)
  where itemList = map parseLine . lines $ input
        itemNames = map getName itemList
        itemMap = M.fromList . map (\item -> (getName item, item)) $ itemList
        parseLine :: String -> Item
        parseLine line = let [name, priceStr, weightStr, sugarStr, maxWeightStr, minBoxesStr] = splitOn ',' line
                         in  Item name (read priceStr) (read weightStr) (read sugarStr) (read maxWeightStr) (read minBoxesStr)

initialShoppingCart :: ItemMap -> ShoppingCart
initialShoppingCart = fmap getMinBoxes

canBuyMore :: ItemMap -> Int -> ShoppingCart -> Item -> Bool
canBuyMore itemMap budget shoppingCart item = isWithinMaxWeight && isWithinBudget
  where currentTotalCost  = calculateTotalPrice itemMap shoppingCart
        itemPrice         = getPrice item
        itemWeight        = getWeight item
        boxes             = shoppingCart M.! (getName item)
        isWithinMaxWeight = boxes < getMaxBoxes item
        isWithinBudget    = (currentTotalCost + itemPrice) <= budget

calculateTotalPrice :: M.Map String Item -> M.Map String Int -> Int
calculateTotalPrice itemMap shoppingCart =
  sum
  . M.mapWithKey (\itemName count -> (getPrice (itemMap M.! itemName )) * count)
  $ shoppingCart

solve :: Int -> ItemMap -> Maybe ShoppingCart
solve budget itemMap = last . takeWhile isJust $ iterate fn (Just (initialShoppingCart itemMap))
  where itemsSortedBySugar = reverse . sortOn getSugarPriceRatio . M.elems $ itemMap
        fn Nothing     = Nothing
        fn (Just cart) = let itemToBuy = find (canBuyMore itemMap budget cart) itemsSortedBySugar
                         in  fmap (\item -> M.adjust (+ 1) (getName item) cart) itemToBuy

formatAnswer :: [String] -> ItemMap -> ShoppingCart -> String
formatAnswer itemNames itemMap cart = intercalate "," (show totalCost : itemStrs)
  where totalCost = calculateTotalPrice itemMap cart
        itemStrs = map (\itemName -> itemName ++ ":" ++ show (cart M.! itemName)) itemNames

main = do
  (itemNames, itemMap) <- parseInput <$> readFile "input.txt"

  let (Just solution) = solve 50000 itemMap

  putStrLn $ formatAnswer itemNames itemMap solution

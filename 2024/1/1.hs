import Data.Map.Strict qualified as M
import Data.Set qualified as S
import System.IO (readFile)

type Point = (Int, Int)

type ComfortLevel = Int

type Blanket = S.Set Point

type CowboyElf = M.Map Point ComfortLevel

data BoundingBox = BoundingBox {maxX :: Int, minX :: Int, maxY :: Int, minY :: Int}

blanketStr :: String
blanketStr =
  " xxx \n\
  \xxxxx\n\
  \xxxxx\n\
  \xxxxx\n\
  \xxxxx\n\
  \  x  \n\
  \xxxxx\n\
  \xxxxx\n\
  \xxxxx\n\
  \xxxxx\n\
  \ xxx "

parseBlanket :: String -> Blanket
parseBlanket =
  S.fromList
    . (=<<) (\(y, xs) -> map (,y) xs)
    . zip [0 ..]
    . map (map fst . filter ((== 'x') . snd) . zip [0 ..])
    . lines

rotateBlanket :: Blanket -> Blanket
rotateBlanket = S.map (\(x, y) -> (y, -x))

translateBlanket :: Int -> Int -> Blanket -> Blanket
translateBlanket dx dy = S.map (\(x, y) -> (x + dx, y + dy))

parseCowboyElf :: String -> M.Map Point Int
parseCowboyElf =
  M.fromList
    . (=<<) (\(y, xcs) -> map (\(x, c) -> ((x, y), c)) xcs)
    . zip [0 ..]
    . map (map (\(x, comfort) -> (x, read [comfort])) . filter ((/= ' ') . snd) . zip [0 ..])
    . lines

boundingBox :: S.Set Point -> BoundingBox
boundingBox points =
  let xs = S.toList . S.map fst $ points
      ys = S.toList . S.map snd $ points
   in BoundingBox (maximum xs) (minimum xs) (maximum ys) (minimum ys)

allBlanketPositions :: CowboyElf -> Blanket -> S.Set Blanket
allBlanketPositions cowboyElf blanket =
  S.unions $ fmap allBlanketPositions' blankets
  where
    blankets = take 4 . iterate rotateBlanket $ blanket
    allBlanketPositions' :: Blanket -> S.Set Blanket
    allBlanketPositions' blanket' =
      let blanketBB = boundingBox blanket'
          cowboyElfBB = boundingBox (M.keysSet cowboyElf)
          blanketStartX = minX cowboyElfBB - maxX blanketBB
          blanketEndX = maxX cowboyElfBB + minX blanketBB
          blanketStartY = minY cowboyElfBB - maxY blanketBB
          blanketEndY = maxY cowboyElfBB + minY blanketBB
          dxs = [blanketStartX .. blanketEndX]
          dys = [blanketStartY .. blanketEndY]
       in S.fromList (concatMap (\dy -> map (\dx -> translateBlanket dx dy blanket') dxs) dys)

totalComfort :: CowboyElf -> Blanket -> Int
totalComfort cowboyElf blanket =
  S.foldr comfortAccumulator 0 overlappingPoints
  where
    overlappingPoints = S.intersection blanket (M.keysSet cowboyElf)
    comfortAccumulator :: Point -> ComfortLevel -> ComfortLevel
    comfortAccumulator point comfortLevel = (cowboyElf M.! point) + comfortLevel

main = do
  cowboyElf <- parseCowboyElf <$> readFile "joe.txt"
  let blanket = parseBlanket blanketStr

  let a = totalComfort cowboyElf <$> S.toList (allBlanketPositions cowboyElf blanket)

  print (maximum a)

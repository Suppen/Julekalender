import Data.Bifunctor (second)
import Data.Map.Strict qualified as M
import Data.Monoid (Sum (..))
import Data.Set qualified as S
import System.IO (readFile)

type Point = (Int, Int)

type ComfortLevel = Int

type Blanket = M.Map Point ComfortLevel

type CowboyElf = M.Map Point ComfortLevel

data BoundingBox = BoundingBox {maxX :: Int, minX :: Int, maxY :: Int, minY :: Int}

rotateBlanket :: Blanket -> Blanket
rotateBlanket = M.mapKeys (\(x, y) -> (y, -x))

translateBlanket :: Int -> Int -> Blanket -> Blanket
translateBlanket dx dy = M.mapKeys (\(x, y) -> (x + dx, y + dy))

mirrorBlanketX :: Blanket -> Blanket
mirrorBlanketX = M.mapKeys (\(x, y) -> (-x, y))

mirrorBlanketY :: Blanket -> Blanket
mirrorBlanketY = M.mapKeys (\(x, y) -> (x, -y))

read' :: Char -> Int
read' '0' = 0
read' '1' = 1
read' '2' = 2
read' '3' = 3
read' '4' = 4
read' '5' = 5
read' '6' = 6
read' 'x' = -2

parse :: String -> M.Map Point Int
parse =
  M.fromList
    . (=<<) (\(y, xcs) -> map (\(x, c) -> ((x, y), c)) xcs)
    . zip [0 ..]
    . map (map (second read') . filter ((/= ' ') . snd) . zip [0 ..])
    . lines

boundingBox :: M.Map Point ComfortLevel -> BoundingBox
boundingBox points =
  let xs = S.toList . S.map fst $ M.keysSet points
      ys = S.toList . S.map snd $ M.keysSet points
   in BoundingBox (maximum xs) (minimum xs) (maximum ys) (minimum ys)

allBlanketPositions :: CowboyElf -> Blanket -> S.Set Blanket
allBlanketPositions cowboyElf blanket =
  S.unions $ fmap allBlanketPositions' blankets
  where
    blankets = (take 4 . iterate rotateBlanket $ blanket) >>= (\b -> [b, mirrorBlanketX b, mirrorBlanketY b])
    allBlanketPositions' :: Blanket -> S.Set Blanket
    allBlanketPositions' blanket' =
      let blanketBB = boundingBox blanket'
          cowboyElfBB = boundingBox cowboyElf
          blanketStartX = minX cowboyElfBB - maxX blanketBB
          blanketEndX = maxX cowboyElfBB + minX blanketBB
          blanketStartY = minY cowboyElfBB - maxY blanketBB
          blanketEndY = maxY cowboyElfBB + minY blanketBB
          dxs = [blanketStartX .. blanketEndX]
          dys = [blanketStartY .. blanketEndY]
       in S.fromList (concatMap (\dy -> map (\dx -> translateBlanket dx dy blanket') dxs) dys)

totalComfort :: CowboyElf -> Blanket -> Int
totalComfort cowboyElf blanket =
  getSum $ foldMap comfortAccumulator overlappingPoints
  where
    overlappingPoints = S.intersection (M.keysSet blanket) (M.keysSet cowboyElf)
    comfortAccumulator :: Point -> Sum ComfortLevel
    comfortAccumulator point = Sum (cowboyElf M.! point * blanket M.! point)

main = do
  cowboyElf <- parse <$> readFile "joe.txt"
  blanket <- parse <$> readFile "teppe.txt"

  let a = totalComfort cowboyElf <$> S.toList (allBlanketPositions cowboyElf blanket)

  print (maximum a)

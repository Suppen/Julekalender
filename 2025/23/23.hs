import qualified Data.Map as M

type Coord = (Integer, Integer)
type Grid = M.Map Coord Char

parseGrid :: String -> Grid
parseGrid =
  M.fromList
  . concatMap (\(y, line) -> zipWith (\x c -> ((x, y), c)) [0..] line)
  . zip [0..]
  . lines

canComeFrom :: Grid -> Coord -> [Coord]
canComeFrom grid (x, y) =
  let up       = (x, y - 1)
      left     = (x - 1, y)
      diagonal = (x - 1, y - 1)
  in  filter (`M.member` grid) [up, left, diagonal]

findKey :: Grid -> Char -> [Coord]
findKey grid c =
  filter ((== Just c) . (`M.lookup` grid))
  . M.keys
  $ grid

countPaths :: Grid -> Coord -> Coord -> Integer
countPaths grid origin target = memo M.! target
  where
    memo = M.fromList [(coord, pathsTo coord) | coord <- M.keys grid]

    pathsTo current
      | origin == current = 1
      | otherwise         =
          sum
          . map (memo M.!)
          . filter ((/= Just 'x') . (`M.lookup` grid))
          $ canComeFrom grid current

main = do
  grid <- parseGrid <$> readFile "input.txt"

  let (startCoord:[]) = findKey grid 'A'
      (endCoord:[])   = findKey grid 'B'

  print $ countPaths grid startCoord endCoord

import System.IO (readFile)
import qualified Data.Map as M
import Data.Bifunctor (bimap)
import Data.List (iterate')
import Data.Maybe (fromJust, isJust)

type Point = (Int, Int)
type Grid = M.Map Point Bool

parseInput :: String -> Grid
parseInput =
    -- Turn it into a map
    M.fromList
    -- Get rid of the letters, so we have tuples of ((lineNumber, charNumber), isSick)
    . (>>= (\(lNo, line) ->
        map (\(cNo, letter) ->
            ((lNo, cNo), letter == 'S'))
        line))
    -- Make tuples with (lineNumber, (charNumber, S/F))
    . map (fmap (zip [0..]))
    -- Make tuples with (lineNumber, line)
    . zip [0..]
    -- Split into lines
    . lines

countSick :: Grid -> Int
countSick = M.size . M.filter id

getNeighbourCoords :: Point -> Grid -> [Point]
getNeighbourCoords point grid =
    -- Ignore the coords outside the grid
    filter (isJust . flip M.lookup grid)
    -- Apply them to the point, so we get an array of neighbours
    . map (\(l, r) -> bimap (+l) (+r) point)
    -- Make
    $ [(1, 0), ((-1), 0), (0, 1), (0, (-1))]

countSickNeighbours :: Point -> Grid -> Int
countSickNeighbours point grid =
    -- Count how many are left
    length
    -- Filter out the healthy ones
    . filter (fromJust . flip M.lookup grid)
    -- Find all neighbouring coordinates
    $ getNeighbourCoords point grid

step :: Grid -> Grid
step grid = M.mapWithKey something grid
    where something _ True  = True
          something point _ = (>= 2) $ countSickNeighbours point grid

solve :: Int -> [Grid] -> Int
solve acc (a:b:gs)
    | aSick == bSick = acc
    | otherwise      = solve (acc+1) (b:gs)
    where aSick = countSick a
          bSick = countSick b

main =
    print
    . solve 1
    . iterate' step
    . parseInput
    =<< readFile "elves.txt"

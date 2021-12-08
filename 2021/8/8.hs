import qualified Data.Map.Strict as M
import Data.Bifunctor (bimap)
import qualified Data.Ix as Ix

type Location = Int
type LocationMap = M.Map Location Point
type Route = [Location]
type Point = (Int, Int)
type Grid = M.Map Point Int

parseInput :: String -> (LocationMap, Route)
parseInput str =
    bimap
      (M.fromDistinctAscList
        . zip [0..]
        . map read)
      (map read)
    . break ((/='(') . head)
    . lines
    $ str

initialGrid :: Grid
initialGrid =
    M.fromDistinctAscList
    . flip zip (repeat 0)
    . Ix.range
    $ ((0,0),(1000,1000))

spreadPackages :: Grid -> Point -> Point -> Grid
spreadPackages grid (x1,y1) (x2,y2) =
    foldr (M.adjust (+1)) grid
    $ Ix.range ((xs,ys),(xe,ye))
    where x2' = if x1 < x2 then x2 - 1 else x2 + 1
          y2' = if y1 < y2 then y2 - 1 else y2 + 1
          xs = min x1 x2'
          xe = max x1 x2'
          ys = min y1 y2'
          ye = max y1 y2'

deliver :: LocationMap -> Route -> Grid -> Maybe Grid
deliver _ [] grid = Just grid
deliver _ (_:[]) grid = Just grid
deliver m (a:b:xs) grid =
    spreadPackages <$> Just grid <*> M.lookup a m <*> M.lookup b m >>= deliver m (b:xs)

main =
    print
    -- Find the corners of what is hopefully a rectangle
    . fmap (\coords ->
        let xs = map fst coords
            ys = map snd coords
            x1 = minimum xs
            x2 = maximum xs
            y1 = minimum ys
            y2 = maximum ys
        in  ((x1,y1),(x2,y2))
      )
    -- Take only their coordinates
    . fmap (M.keys)
    -- Find all cells with as many packages as the one with most
    . fmap (\grid ->
        let most = maximum . M.elems $ grid
        in  M.filter (== most) grid
      )
    -- Spread the packages
    . (\(locationMap, route) -> deliver locationMap route initialGrid)
    . parseInput
    =<< readFile "input.txt"

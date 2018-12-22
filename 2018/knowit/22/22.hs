import System.IO (readFile)
import Data.List.Split (splitOn)

type Point = (Double, Double)

distanceBetween :: Point -> Point -> Double
distanceBetween (x1, y1) (x2, y2) =
    sqrt ((x2-x1)^2 + (y2-y1)^2)

limits :: [Point] -> (Point, Point)
limits = limits' ((-1000000, -1000000), (1000000, 1000000))
    where limits' l [] = l
          limits' ((maxX, maxY), (minX, minY)) ((x,y):xs) =
              limits' (((max maxX x), (max maxY y)), ((min minX x), (min minY y))) xs

main = do
    content <- readFile "input.txt"
    print
        . limits
        . map (\[x,y] -> (read x, read y) :: Point)
        . map (splitOn ",")
        . lines
        $ content

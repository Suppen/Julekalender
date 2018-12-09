import System.IO (readFile)
import Data.List.Split (splitOn)
import Data.List (sortBy)

stalinsort :: (Ord a, Ord b) => [(a, b)] -> [(a, b)]
stalinsort []       = []
stalinsort (x:[])   = [x]
stalinsort ((x@(xc,xh)):(y@(yc,yh)):ys)
    | yc /= xc && yh /= xh = x : stalinsort (y:ys)
    | otherwise            = stalinsort (x:ys)

main = do
    content <- readFile "input.txt"
    print
        . (+1)
        . length
        . stalinsort
        . sortBy (\a b -> compare (snd b) (snd a))
        . map (\[color, height] -> (color, read height :: Int))
        . map (splitOn ",")
        . lines
        $ content

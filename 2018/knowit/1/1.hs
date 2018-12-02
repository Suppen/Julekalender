import System.IO (readFile)

stalinsort :: (Ord a) => [a] -> [a]
stalinsort []       = []
stalinsort (x:[])   = [x]
stalinsort (x:y:ys)
    | y >= x     = x : stalinsort (y:ys)
    | otherwise  = stalinsort (x:ys)

main = do
    content <- readFile "input.txt"
    putStrLn
        . show
        . sum
        . stalinsort
        . map read
        . lines
        $ content

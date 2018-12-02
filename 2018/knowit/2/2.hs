import System.IO (readFile)
import Data.List.Split (splitOn)
import qualified Data.Map.Strict as M
import Data.Ratio ((%), Rational)

type Point = (Integer, Integer)

getSlope :: Point -> Point -> Rational
getSlope (x1, y1) (x2, y2) = (y2 - y1) % (x2 - x1)

countOccurences :: (Ord k, Foldable t, Num a) => t k -> M.Map k a
countOccurences list = foldr count M.empty list
    where count k m
              | M.member k m = M.adjust (+1) k m
              | otherwise    = M.insert k 1 m

main = do
    content <- readFile "input.txt"
    putStrLn
        . show
        . foldr1 max
        . countOccurences
        . map (\([p1,p2]) -> getSlope p1 p2)
        . map (map read)
        . map (splitOn ";")
        . lines
        $ content

import System.IO (readFile)
import qualified Data.Map.Strict as M
import Data.Maybe (fromJust)

alphabet :: [Char]
alphabet = " " ++ ['A'..'Z'] ++ "ÆØÅ" ++ ['a'..'z'] ++ "æøå"

charToInt :: Char -> Maybe Int
charToInt c = M.lookup c m
    where m :: M.Map Char Int
          m = M.fromList $ zip alphabet [0..]

removeUnsorted :: (Ord a) => [a] -> [a]
removeUnsorted [] = []
removeUnsorted xs@(_:[]) = xs
removeUnsorted (a:b:xs) = if   a `compare` b == LT
                          then a : removeUnsorted(b:xs)
                          else removeUnsorted (a:xs)

main =
    print
    . sum
    . map length
    . removeUnsorted
    . map (map (fromJust . charToInt))
    . lines
    =<< readFile "alverekke.txt"

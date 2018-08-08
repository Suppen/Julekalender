-- Must be compiled with '-O', or it will gobble all available memory and segfault

import Data.List (permutations, splitAt)

-- Splits a number string at a specified position. For example, `splitNumStr "1234567890" 3` returns (123,4567890)
splitNumStr :: String -> Int -> (Int,Int)
splitNumStr numStr n = (read a, read b)
    where (a,b) = splitAt n numStr

-- Splits a number string in all possible locations. "1234567890" -> [(1,234567890), (12,34567890), (123,4567890)...]
allPossibleNumStrSplits :: String -> [(Int,Int)]
allPossibleNumStrSplits numStr = map (splitNumStr numStr) [1..9]

-- All possible pair of numbers which can be created from the digits 0-9
pairs :: [(Int,Int)]
pairs = concat
        . map allPossibleNumStrSplits
        . permutations
        $ ['0'..'9']

-- List of all products of the pairs
products :: [Int]
products = map (\(a,b) -> a*b) pairs

-- The secret number to find
alvinsNumber :: Int
alvinsNumber = maximum products

main = putStrLn $ show alvinsNumber

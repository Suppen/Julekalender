-- Must be compiled with '-O', or it will gobble all available memory and segfault

import Data.List (permutations, splitAt)

-- | Builds a number from a list of digits
buildNum :: [Int] -> Int
buildNum digits = foldl (\num d -> d + num*10) 0 digits

-- Splits a number at a specified position. For example, `splitNum 1234567890 3` returns (123,4567890)
splitNum :: [Int] -> Int -> (Int,Int)
splitNum digits n = (buildNum a, buildNum b)
    where (a,b) = splitAt n digits

-- Splits a number in all possible locations. 1234567890 -> [(1,234567890), (12,34567890), (123,4567890)...]
allPossibleNumSplits :: [Int] -> [(Int,Int)]
allPossibleNumSplits digits = map (splitNum digits) [1..9]

-- All possible pair of numbers which can be created from the digits 0-9
pairs :: [(Int,Int)]
pairs = concat
        . map allPossibleNumSplits
        . permutations
        $ [0..9]

-- List of all products of the pairs
products :: [Int]
products = map (\(a,b) -> a*b) pairs

-- The secret number to find
alvinsNumber :: Int
alvinsNumber = maximum products

main = putStrLn $ show alvinsNumber


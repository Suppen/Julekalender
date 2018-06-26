import Data.List
import System.IO

main = do
    contents <- readFile "5.txt"
    let counts = let words = lines contents
                     sortedWords = map sort words
                     sortedWordsList = sort sortedWords
                 in  map length $ group $ sortedWordsList
    putStrLn $ show $ sum $ filter (>1) counts

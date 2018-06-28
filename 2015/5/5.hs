import Data.List
import System.IO

main = do
    contents <- readFile "5.txt"
    let words = lines contents
        sortedWords = map sort words
        sortedWordsList = sort sortedWords
        counts = map length $ group $ sortedWordsList
    putStrLn $ show $ sum $ filter (>1) counts

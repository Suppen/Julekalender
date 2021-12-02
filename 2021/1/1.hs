import System.IO (readFile)
import Data.List (find, isPrefixOf)

numberwords :: [(String, Int)]
numberwords = [
        ("elleve", 11), ("tolv", 12), ("tretten", 13),
        ("fjorten", 14), ("femten", 15), ("seksten", 16),
        ("sytten", 17), ("atten", 18), ("nitten", 19),
        ("tjue", 20), ("tretti", 30), ("foerti", 40),
        ("femti", 50), ("en", 1), ("to", 2),
        ("tre", 3), ("fire", 4), ("fem", 5),
        ("seks", 6), ("sju", 7), ("aatte", 8),
        ("ni", 9), ("ti", 10)
    ]

solve :: String -> Int -> Int
solve "\n" acc = acc
solve str acc = solve str' (acc + val)
    where Just (numberword, val) = find ((`isPrefixOf` str) . fst) $ numberwords
          str' = drop (length numberword) str

main = print
    . (\str -> solve str 0)
    =<< readFile "tallhs.txt"

import System.IO (readFile)

letters :: [(Char, Int)]
letters = zip ['a'..'z'] [0..]

process :: Char -> Int -> String -> String
process _ _ [] = []
process c n (x:xs)
    | x == c && n == 0 = x : process c (n-1) xs
    | x == c && n /= 0 = process c (n-1) xs
    | otherwise        = x : process c n xs

solve :: String -> String
solve = (\str -> foldr (\(c, n) str' -> process c n str') str letters)

main =
    print
    . solve
    =<< readFile "text.txt"

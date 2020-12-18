import System.IO (readFile)

isAlmostPalindrome :: String -> Bool
isAlmostPalindrome word
    | l < 3         = False
    | word == rWord = False
    | otherwise     = isAlmostPalindrome' word rWord
    where l = length word
          rWord = reverse word
          isAlmostPalindrome' :: String -> String -> Bool
          isAlmostPalindrome' [] [] = True
          isAlmostPalindrome' (a:[]) (a':[]) = a == a'
          isAlmostPalindrome' (a:b:rest) (a':b':rest')
              | a == a'            = isAlmostPalindrome' (b:rest) (b':rest')
              | a == b' && a' == b = isAlmostPalindrome' rest rest'
              | otherwise          = False

main =
    print
    . length
    . filter isAlmostPalindrome
    . lines
    =<< readFile "wordlist.txt"

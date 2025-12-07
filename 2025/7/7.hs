import Data.List (findIndices)
import Control.Monad (guard)

isTrollWord :: String -> Bool
isTrollWord word = let ts = findIndices (== 't') word
                       rs = findIndices (== 'r') word
                       os = findIndices (== 'o') word
                       ls = findIndices (== 'l') word
                   in  not . null $ findTroll ts rs os ls
  where findTroll ts rs os ls = do
          t <- ts
          r <- filter (\i -> i > t + 1 && i <= t + 6) rs
          o <- filter (\i -> i > r + 1 && i <= r + 6) os
          l1 <- filter (\i -> i > o + 1 && i <= o + 6) ls
          l2 <- filter (\i -> i > l1 + 1 && i <= l1 + 6) ls

          return True

isNisseWord :: String -> Bool
isNisseWord word = let ns = findIndices (== 'n') word
                       is = findIndices (== 'i') word
                       ss = findIndices (== 's') word
                       es = findIndices (== 'e') word
                   in  not . null $ findNisse ns is ss es
  where findNisse ns is ss es = do
          guard (head word /= 'n')

          n <- ns
          i <- filter (\ix -> ix > n && ix <= n + 3) is
          s1 <- filter (\ix -> ix > i && ix <= i + 3) ss
          s2 <- filter (\ix -> ix > s1 && ix <= s1 + 3) ss
          e <- filter (\ix -> ix > s2 && ix <= s2 + 3) es

          guard (last word /= 'e')

          return True


main = do
  words <- lines <$> readFile "ordliste.txt"

  print
    . length
    . filter (\word -> isTrollWord word || isNisseWord word)
    $ words

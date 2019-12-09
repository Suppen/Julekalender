import Debug.Trace (trace)
import System.IO (readFile)

isKrampus :: Int -> Bool
isKrampus n = any (==n) candidates
    where square = n^2
          nStr = show square
          splitPoints = [1..length nStr - 1]
          isZero = all (== '0')
          candidates =
              map (\(a, b) -> read a + read b)
                  . filter (\(a, b) -> (not . isZero $ a) && (not . isZero $ b))
                  . map (\m -> splitAt m nStr)
                  $ splitPoints

main =
    print
        . sum
        . filter isKrampus
        . map read
        . lines
        =<< readFile "input.txt"

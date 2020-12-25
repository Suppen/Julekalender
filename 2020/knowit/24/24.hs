import System.IO (readFile)
import Data.List (scanl')

visitHouses :: Int -> Char -> Int
visitHouses remaining '1' = remaining + 1
visitHouses remaining '0' = remaining - 1

main =
    print
    . length
    . takeWhile (> 0)
    . scanl' visitHouses 10
    =<< readFile "rute.txt"
    -- $ "11001100100010000000010000000000010000000010000001"

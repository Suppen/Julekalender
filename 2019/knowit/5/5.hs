import System.IO (readFile)
import Data.List.Split (chunksOf)

main =
    print
        . concat
        . reverse
        . (\list -> chunksOf (length list `div` 2) list)
        . concat
        . map reverse
        . chunksOf 2
        . concat
        . reverse
        . chunksOf 3
        . filter (/= '\n')
        =<< readFile "input.txt"

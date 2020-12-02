import System.IO (readFile)
import qualified Data.Set as S

main =
    print
    . head
    . S.toList
    . S.difference (S.fromDistinctAscList [1..100000])
    . S.fromList
    . map read
    . lines
    =<< readFile "input_modified.txt"

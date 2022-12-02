import System.IO (readFile)
import Data.List (isInfixOf)

solve :: [String] -> Int -> Int -> Int
solve gifts verseNo sungLines
    | verseNo > length gifts = sungLines
    | otherwise              =
        let thisVerse = take verseNo gifts
            thisVerse' = filter (not . isInfixOf "alv") (init thisVerse) ++ [last thisVerse]
        in  solve gifts (verseNo + 1) (sungLines + 1 + max (length thisVerse' - 2) 1)


main =
    print
    . (\gifts -> solve gifts 1 0)
    . lines
    =<< readFile "gaver.txt"

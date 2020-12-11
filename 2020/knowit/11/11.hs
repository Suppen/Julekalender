import System.IO (readFile)
import Data.Char (ord, chr)
import Data.List (transpose, isSubsequenceOf, find)

processWord :: String -> String
processWord word =
    zipWith addLetters word
    . map shiftLetter
    . tail
    $ word
    where shiftLetter 'z' = 'a'
          shiftLetter c   = succ c
          alphabetPos c   = ord c - ord 'a'
          addLetters a b  =
              chr
              . (+ ord 'a')
              $ (alphabetPos a + alphabetPos b) `mod` (ord 'z' - ord 'a' + 1)

makeHintList :: String -> [String]
makeHintList =
    takeWhile (not . null)
    . iterate processWord

checkWord :: String -> String -> Bool
checkWord hint =
    any (isSubsequenceOf hint)
    . transpose
    . makeHintList

main =
    print
    . find (checkWord "eamqia")
    . lines
    =<< readFile "hint.txt"

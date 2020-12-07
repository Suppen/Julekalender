import System.IO (readFile)

elves :: Int
elves = 127

main =
    print
    . (`div` elves)
    . head
    . dropWhile ((/= 0) . (`mod` elves))
    . scanr1 (+)
    . reverse
    . map read
    . lines
    =<< readFile "godteri_newlines.txt"

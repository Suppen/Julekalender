import System.IO (readFile)
import Data.List (transpose)
import Data.List.Split (splitWhen)

type Tree = [String]

isSymmetrical :: String -> Bool
isSymmetrical s = s == reverse s

getTrees :: [String] -> [Tree]
getTrees =
    filter (/= [])
    . map transpose
    . splitWhen (all (== ' '))
    . transpose

main =
    print
    . length
    . filter (all isSymmetrical)
    . getTrees
    . lines
    =<< readFile "forest.txt"

import Data.List (isInfixOf)
import Control.Monad ((<=<))

nodes :: [Char]
nodes = ['A'..'I']

codeLength :: Int
codeLength = 8

neighbours :: [Char] -> [Char]
neighbours code = filter (`notElem` code) . neighbours' $ code
    where neighbours' :: [Char] -> [Char]
          neighbours' ('A':cs) = "BDEFH" ++ something [('C', 'B'), ('G', 'D'), ('I', 'E')]
          neighbours' ('B':cs) = "ACDEFGI" ++ something [('H', 'E')]
          neighbours' ('C':cs) = "BDEFH" ++ something [('A', 'B'), ('G', 'E'), ('I', 'F')]
          neighbours' ('D':cs) = "ABCEGHI" ++ something [('F', 'E')]
          neighbours' ('E':cs) = "ABCDFGHI"
          neighbours' ('F':cs) = "ABCEGHI" ++ something [('D', 'E')]
          neighbours' ('G':cs) = "BDEFH" ++ something [('A', 'D'), ('C', 'E'), ('I', 'H')]
          neighbours' ('H':cs) = "ACDEFGI" ++ something [('B', 'E')]
          neighbours' ('I':cs) = "BDEFH" ++ something [('A', 'E'), ('G', 'H'), ('C', 'F')]
          something :: [(Char, Char)] -> [Char]
          something = concat . map (\(c, cond) -> if cond `elem` code then [c] else [])

build :: [Char] -> [[Char]]
build code = map (:code) (neighbours code)

allCodes :: [[Char]]
allCodes =
    foldr1 (<=<) (replicate (codeLength-1) build) "D"

main =
    print
    . length
    $ allCodes

import System.IO (readFile)

data Tree = Tree String [Tree] deriving (Read, Show)

data Token = Elf String | Open | Close deriving (Show)

tokenize :: String -> [Token]
tokenize []                           = []
tokenize (' ':xs)                     = tokenize xs
tokenize ('(':xs)                     = Open : tokenize xs
tokenize (')':xs)                     = Close : tokenize xs
tokenize str                          =
    let (name, rest) = break (`elem` [' ', '(', ')']) str
    in  Elf name : tokenize rest

prepareForTree :: [Token] -> String
prepareForTree []                           = []
prepareForTree (Elf name : Open : xs)       = "Tree \"" ++ name ++ "\" [" ++ prepareForTree xs
prepareForTree (Elf name : Close : xs)      = "Tree \"" ++ name ++ "\" []" ++ prepareForTree (Close : xs)
prepareForTree (Elf name : xs)              = "Tree \"" ++ name ++ "\" [], " ++ prepareForTree xs
prepareForTree (Close : Close : xs)         = ']' : prepareForTree (Close : xs)
prepareForTree (Close : [])                 = "]"
prepareForTree (Close : xs)                 = "], " ++ prepareForTree xs

getDepth :: Tree -> Int
getDepth (Tree name children)
    | null children    = 0
    | name == "Grinch" = deepestChild
    | otherwise        = deepestChild + 1
    where deepestChild = maximum . map getDepth $ children

main = do
    contents <- readFile "tree.modified.txt"

    let prepared = prepareForTree . tokenize . init $ contents

    print . getDepth . read $ prepared

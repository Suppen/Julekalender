import Numeric (readHex, showHex)

data Tree a = Node a (Tree a) (Tree a) | Empty deriving (Show)

insert :: (Ord a) => a -> Tree a -> Tree a
insert x Empty = Node x Empty Empty
insert x (Node y left right)
    | x < y = Node y (insert x left) right
    | x > y = Node y left (insert x right)
    | otherwise = Node y left right

parents :: (Ord a) => a -> Tree a -> [a]
parents x Empty = []
parents x (Node y left right)
    | x < y = y : parents x left
    | x > y = y : parents x right
    | otherwise = [y]

parseHex :: String -> Integer
parseHex = fst . head . readHex . tail

stringifyHex :: Integer -> String
stringifyHex = ("#" ++) . flip showHex ""

main = do
    (a:b:c:xs) <- map parseHex . lines <$> readFile "kuler.txt"

    let initialTree = Node a (Node b Empty Empty) (Node c Empty Empty)
        kuler = foldl (flip insert) initialTree xs
        halvorsFavorite = parseHex "#811A89"
        alvhildsFavorite = parseHex "#8EAA54"
        parents1 = parents halvorsFavorite kuler
        parents2 = parents alvhildsFavorite kuler
        closestCommonParent = fst . last . takeWhile (uncurry (==)) $ zip parents1 parents2

    print . stringifyHex $ closestCommonParent

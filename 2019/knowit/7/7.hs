magicNumber :: Int
magicNumber = 27644437

specialDividend :: Int
specialDividend = 5897

-- List of all possible b values for day x, as tuples of (y', b)
b :: Int -> [(Int, Int)]
b x = [(y', y'*x) | y' <- [2..magicNumber-1]]

-- Calculates (y', b `rem` magicNumber) from (y', b) 
r :: (Int, Int) -> (Int, Int)
r = fmap (`rem` magicNumber)

-- Finds the y' value where r == 1 in (y', r)
y :: Int -> Int
y x =
    fst
        . head
        . dropWhile ((/= 1) . snd)
        . fmap r
        . b
        $ x

-- Calculates the z value of a y value
z :: Int -> Int
z y = specialDividend * y

-- Calculates the code for day x
codeForDay :: Int -> Int
codeForDay x = (z . y $ x) `rem` magicNumber

main = print . codeForDay $ 7

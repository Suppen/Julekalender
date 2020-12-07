import System.IO (readFile)

type Point = (Int, Int)

findVertices :: String -> [Point]
findVertices s = (0,0) : findVertices' (0,0) s

findVertices' :: Point -> String -> [Point]
findVertices' p [] = [p]
findVertices' (x,y) as@(a:_)
    | a == 'H' = something (x+1,y) as
    | a == 'V' = something (x-1,y) as
    | a == 'O' = something (x,y-1) as
    | a == 'N' = something (x,y+1) as
    where something p (a1:[]) = []
          something p (a1:a2:as)
              | a1 /= a2  = p : findVertices' p (a2:as)
              | otherwise = findVertices' p (a2:as)

calculateArea :: [Point] -> Int
calculateArea vs =
    abs
    . (`div` 2)
    . sum
    $ zipWith det (last vs : init vs) vs
        where det (x1,y1) (x2,y2) = (x2+x1) * (y2-y1)

main =
    print
    . calculateArea
    . findVertices
    =<< readFile "rute.txt"
    -- $ "HHOOVVNN"
    -- $ "HHHHHHOOOOVVNNNVVOVVNN"

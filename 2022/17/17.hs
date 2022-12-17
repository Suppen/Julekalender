import  Data.Map.Strict (Map, fromDistinctAscList, insert, mapWithKey, elems, (!))

relations :: Map Int [Int]
relations =
    fromDistinctAscList [
         (0, [0..5]),
         (1, [0..6]),
         (2, [0..7]),
         (3, [0..8]),
         (4, [0..9]),
         (5, [0..9]),
         (6, [1..9]),
         (7, [2..9]),
         (8, [3..9]),
         (9, [4..9])
       ]

firstHeight :: Map Int Integer
firstHeight =
    fromDistinctAscList [
         (0, 1),
         (1, 1),
         (2, 1),
         (3, 1),
         (4, 1),
         (5, 1),
         (6, 1),
         (7, 1),
         (8, 0),
         (9, 0)
       ]

secondHeight :: Map Int Integer
secondHeight = insert 9 0 $ otherHeights firstHeight

otherHeights :: Map Int Integer -> Map Int Integer
otherHeights m = mapWithKey mapFn m
    where mapFn :: Int -> Integer -> Integer
          mapFn h w =
              let rs = relations ! h
               in sum $ map ((m !)) rs


sumWays :: Map Int Integer -> Integer
sumWays = sum . elems

makeFn :: Int -> String
makeFn n = show . sumWays $ foldr1 (.) (replicate (n - 2) otherHeights) secondHeight

main =
    putStrLn (makeFn 7 ++ ";" ++ makeFn 19)

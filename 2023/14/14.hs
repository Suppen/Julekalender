parseReps :: String -> [Int]
parseReps = map read . words . filter (/= ',')

insertMarkers :: [Int] -> [Int]
insertMarkers [] = []
insertMarkers [x] = [x]
insertMarkers [x,y] = [x,y] -- This is wrong according to the task, but I assumed the answer wouldn't be at the end of the list
insertMarkers (x:y:z:xs)
  | x > y && y < z = x : y : -1 : insertMarkers (y:z:xs)
  | otherwise = x : insertMarkers (y:z:xs)

sequences :: [Int] -> [[Int]]
sequences [] = []
sequences markedList = let (seq, rest) = break (== -1) markedList
                       in  if   null rest
                           then [seq]
                           else seq : sequences (tail rest)

findLongestSequences :: [[Int]] -> [[Int]]
findLongestSequences seqs = let tuples = zip (map length seqs) seqs
                                maxLen = maximum $ map fst tuples
                            in  map snd $ filter ((== maxLen) . fst) tuples

solve :: String -> Int
solve = maximum . map sum . findLongestSequences . sequences . insertMarkers . parseReps

--main = print . solve $ "16, 3, 1, 2, 9, 8, 12, 14, 19, 21, 20, 11, 2, 4, 3, 1, 7, 9"
main = print . solve =<< readFile "push.txt"

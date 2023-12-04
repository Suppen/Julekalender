parseReps :: String -> [Int]
parseReps = map read . words . filter (/= ',')

insertMarkers :: [Int] -> [Int]
insertMarkers [] = []
insertMarkers [x] = [x]
insertMarkers (x:y:xs)
  | x <= y = x : insertMarkers (y:xs)
  | otherwise = x : -1 : insertMarkers (y:xs)

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

main = print . solve =<< readFile "reps.txt"

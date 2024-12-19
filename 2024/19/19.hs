import Data.List (group, sort, splitAt)

toDigits :: Int -> Int -> [Int]
toDigits base num
  | num == 0 = [0]
  | otherwise = digits' num []
  where
    digits' :: Int -> [Int] -> [Int]
    digits' 0 acc = acc
    digits' num acc = digits' (num `div` base) (num `mod` base : acc)

splitIntoGroups :: [Int] -> [a] -> [[a]]
splitIntoGroups [] as = [as]
splitIntoGroups (p : ps) as =
  let (a, as') = splitAt p as
   in a : splitIntoGroups ps as'

padStart :: Int -> a -> [a] -> [a]
padStart n x xs = replicate (n - length xs) x ++ xs

isDombjelletall :: Int -> Bool
isDombjelletall n =
  let digits = padStart 16 0 $ toDigits 2 n
      groupTemplates =
        [ [2, 2, 6],
          [2, 6, 2],
          [2, 6, 6],
          [3, 3, 5],
          [3, 5, 3],
          [3, 5, 5],
          [4, 4, 4],
          [5, 3, 3],
          [5, 3, 5],
          [5, 5, 3],
          [6, 2, 2],
          [6, 2, 6],
          [6, 6, 2]
        ]
      groups = map (`splitIntoGroups` digits) groupTemplates
   in elem [2, 2] $ map (map length . group . sort) groups

main = print . length . filter isDombjelletall $ [0 .. 2 ^ 16 - 1]

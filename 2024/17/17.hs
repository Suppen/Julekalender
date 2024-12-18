import Data.List (permutations)

toDigits :: Int -> Int -> [Int]
toDigits base num
  | num == 0 = [0]
  | otherwise = digits' num []
  where
    digits' :: Int -> [Int] -> [Int]
    digits' 0 acc = acc
    digits' num acc = digits' (num `div` base) (num `mod` base : acc)

fromDigits :: Int -> [Int] -> Int
fromDigits base = foldl (\acc d -> acc * base + d) 0

partitions :: [a] -> [[[a]]]
partitions [] = [[]]
partitions xs = [ys : zs | (ys, rest) <- splits xs, zs <- partitions rest]
  where
    splits :: [a] -> [([a], [a])]
    splits [] = []
    splits [x] = [([x], [])]
    splits (x : xs) = [(x : ys, zs) | (ys, zs) <- splits xs] ++ [([x], xs)]

isPseudoVampireNumber :: Int -> Bool
isPseudoVampireNumber n =
  let digits = toDigits 10 n
      perms = permutations digits
      allSplits = perms >>= partitions
      factors = filter ((> 1) . length) $ map (map (fromDigits 10)) allSplits
   in any ((== n) . product) factors

main = do
  nums <- map read . lines <$> readFile "tall.txt"

  print (sum . filter isPseudoVampireNumber $ nums)

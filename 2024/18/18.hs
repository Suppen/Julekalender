-- Note: This is slightly different from previous ones. This one returns the digits in *reverse*, in order to make it
-- lazy
toDigits :: Integer -> Integer -> [Integer]
toDigits base num
  | num == 0 = [0]
  | otherwise = digits' num
  where
    digits' 0 = []
    digits' num = num `mod` base : digits' (num `div` base)

fromDigits :: Integer -> [Integer] -> Integer
fromDigits base = foldl (\acc d -> acc * base + d) 0

highestPowerOf :: Integer -> Integer -> Integer
highestPowerOf _ 0 = 0
highestPowerOf b n = go n 0
  where
    go x acc
      | x `mod` b /= 0 = acc
      | otherwise = go (x `div` b) (acc + 1)

alvonacci :: [Integer]
alvonacci = 0 : 1 : alvonacci' 2 0 1 0 (repeat alvonacci)
  where
    alvonacci' n a b extra alvs =
      let p = fromIntegral $ highestPowerOf 5 n
          alv = alvs !! p
          nextElem = if p == 0 then a + b + extra else head alv
          nextExtra = if p == 0 then 0 else a
       in nextElem : alvonacci' (n + 1) b nextElem nextExtra (take p alvs ++ [tail alv] ++ drop (p + 1) alvs)

main =
  print $
    alvonacci !! (5 ^ 8 - 1)

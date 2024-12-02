primes :: [Integer]
primes = 2 : primes'
  where
    isPrime (p : ps) n = p * p > n || n `rem` p /= 0 && isPrime ps n
    primes' = 3 : filter (isPrime primes') [5, 7 ..]

digits :: Integer -> Integer -> [Integer]
digits base num
  | num == 0 = [0]
  | otherwise = digits' num []
  where
    digits' :: Integer -> [Integer] -> [Integer]
    digits' 0 acc = acc
    digits' num acc = digits' (num `div` base) (num `mod` base : acc)

digitSum :: Integer -> Integer
digitSum = sum . digits 10

main =
  print
    . sum
    . take 10000
    . map fst
    . filter (\(prime, pos) -> digitSum prime == digitSum pos)
    $ zip primes [1 ..]

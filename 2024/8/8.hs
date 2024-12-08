import Data.List (transpose)
import Data.Set (fromAscList, intersection, size)

primes :: [Int]
primes = 2 : primes'
  where
    isPrime (p : ps) n = p * p > n || n `rem` p /= 0 && isPrime ps n
    primes' = 3 : filter (isPrime primes') [5, 7 ..]

digits :: Int -> Int -> [Int]
digits base num
  | num == 0 = [0]
  | otherwise = digits' num []
  where
    digits' :: Int -> [Int] -> [Int]
    digits' 0 acc = acc
    digits' num acc = digits' (num `div` base) (num `mod` base : acc)

primtalv :: [Int]
primtalv =
  map
    ( sum
        . zipWith (\p n -> 10 ^ p * n) [0 ..]
        . map sum
        . transpose
        . map (digits 10)
    )
    $ take <$> [0 ..] <*> [primes]

main =
  let n = 10000000
      primeSet = fromAscList $ takeWhile (<= n) primes
      primtalvSet = fromAscList $ takeWhile (<= n) primtalv
   in print $ size $ intersection primeSet primtalvSet

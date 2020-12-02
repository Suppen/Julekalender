import qualified Data.Set as S

-- Stolen from https://www.reddit.com/r/haskell/comments/35vc31/the_real_way_to_generate_a_list_of_primes_in/
primes :: [Int]
primes = 2 : primes'
    where isPrime (p:ps) n = p*p > n || n `rem` p /= 0 && isPrime ps n
          primes' = 3 : filter (isPrime primes') [5, 7 ..]

primeSet :: Int -> S.Set Int
primeSet n =
    S.fromDistinctAscList
    . takeWhile (<= n)
    $ primes

includes7 :: Int -> Bool
includes7 0 = False
includes7 n = n `mod` 10 == 7 || includes7 (n `div` 10)

luke2 :: Int -> Int
luke2 n =
    luke2' 0 0
    where luke2' i delivered
              | i >= n      = delivered
              | includes7 i = luke2' (i+(p i)+1) delivered
              | otherwise   = luke2' (i+1) (delivered+1)
          p i
              | S.member i ps = i
              | otherwise     = p (i-1)
          ps = primeSet n

main = print . luke2 $ 5433000

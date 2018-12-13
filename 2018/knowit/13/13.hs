nums :: [Int]
nums = 1 : 3 : gen 4 2
    where gen n m
              | isValid   = n : gen (n+1) (m+1)
              | otherwise = gen (n+1) m
              where nums' = take m nums
                    isValid = (==1)
                                  . length
                                  . take 2
                                  . filter (\(a, b) -> a `elem` nums' && b `elem` nums')
                                  . takeWhile (\(a, b) -> a < b)
                                  $ zip [1..] [n-1, n-2 ..]

-- Stolen from https://www.reddit.com/r/haskell/comments/35vc31/the_real_way_to_generate_a_list_of_primes_in/
primes :: [Int]
primes = 2 : primes'
    where isPrime (p:ps) n = p*p > n || n `rem` p /= 0 && isPrime ps n
          primes' = 3 : filter (isPrime primes') [5, 7 ..]

primeNums :: [Int]
primeNums = filter (\a -> a `elem` takeWhile (<=a) primes) nums

main = print . sum . take 100 $ primeNums

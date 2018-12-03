import qualified Data.Sequence as S

type PrimeIndices = S.Seq Int

-- Find christmas numbers up to this number (inclusive)
upperBound :: Int
upperBound = 4294967296

-- Number of factors in the products
factors :: Int
factors = 24

-- Stolen from https://www.reddit.com/r/haskell/comments/35vc31/the_real_way_to_generate_a_list_of_primes_in/
primes :: [Int]
primes = 2 : primes'
    where isPrime (p:ps) n = p*p > n || n `rem` p /= 0 && isPrime ps n
          primes' = 3 : filter (isPrime primes') [5, 7 ..]

-- Make a sequence of the necessary primes. Sequences have lookup time of O(log n), while lists have O(n)
necessaryPrimes :: S.Seq Int
necessaryPrimes = S.fromList necessaryPrimes'
    where necessaryPrimes' = takeWhile (< upperBound `div` (2 ^ (factors - 1))) primes

-- There is a minimum power of two in these products. Any fewer, and the product always exceeds upperBound
minPowerOf2 :: Int
minPowerOf2 = fn 0
    where fn n
              | 2^n * 3^(factors-n) > upperBound = fn (n+1)
              | otherwise                        = n

-- The product of the minimum power of two
constantFactor :: Int
constantFactor = 2 ^ minPowerOf2

-- Calculates the product of an array of factors
calculateProduct :: PrimeIndices -> Int
calculateProduct =
    (* constantFactor)
    . foldr1 (*)
    . fmap (S.index necessaryPrimes)

-- Calculates the next prime indices fulfilling the conditions
next :: PrimeIndices -> Maybe PrimeIndices
next primeIndices = next' (S.adjust (+1) 0 primeIndices) 0
    where next' primeIndices current
              | current >= S.length primeIndices                         = Nothing
              | S.index primeIndices current >= S.length necessaryPrimes = overflow primeIndices current
              | calculateProduct primeIndices > upperBound               = overflow primeIndices current
              | otherwise                                                = Just primeIndices
          -- Add one to the next prime index and go to the real overflow function
          overflow primeIndices n = overflow' (S.adjust (+1) (n+1) primeIndices) n (n+1)
          -- Set all previous indices equal to the current index
          overflow' primeIndices (-1) n = next' primeIndices n
          overflow' primeIndices i n    = overflow' (S.update i (S.index primeIndices n) primeIndices) (i-1) n

-- Solves the task
solve primeIndices = solve' (return primeIndices) 0
    where solve' Nothing n      = n
          solve' primeIndices n = solve' (primeIndices >>= next) (n+1)

main = do
    putStrLn
        . show
        . solve
        . S.fromList
        . take (factors - minPowerOf2)
        $ repeat 0

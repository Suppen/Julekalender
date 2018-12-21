limit :: Int
limit = 10000000

-- Stolen from https://www.reddit.com/r/haskell/comments/35vc31/the_real_way_to_generate_a_list_of_primes_in/
primes :: [Int]
primes = 2 : primes'
    where isPrime (p:ps) n = p*p > n || n `rem` p /= 0 && isPrime ps n
          primes' = 3 : filter (isPrime primes') [5, 7 ..]

isAbundant :: Int -> Bool
isAbundant n = isAbundant' 1 2 n -- Sum starts at 1 because 1 is always a divisor
    where isAbundant' :: Int -> Int -> Int -> Bool
          isAbundant' sum divisor n
              -- The sum has exceeded the number. This is abundant
              | sum > n              = True
              -- The divisor is larger than the square root of the number. All divisors have been checked. This is not abundant
              | divisor^2 > n        = False
              -- The divisor is the square root of the number. Add it only once
              | divisor^2 == n       = isAbundant' (sum + divisor) (divisor+1) n
              -- The current divisor evenly divides the number. Add both it and the result to the sum, as both are divisors
              | n `mod` divisor == 0 = isAbundant' (sum + divisor + (n `div` divisor)) (divisor+1) n
              -- This is not a divisor of n. Check the next divisor
              | otherwise            = isAbundant' sum (divisor+1) n

inbetweens :: [Int]
inbetweens = inbetweens' primes
    where inbetweens' (x:y:ys) = if   y - x == 2
                                 then (y-1) : inbetweens' (y:ys)
                                 else inbetweens' (y:ys)

main =
    print
        . sum
        . filter isAbundant
        . takeWhile (<=limit)
        $ inbetweens

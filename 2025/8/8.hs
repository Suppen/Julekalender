-- Stolen from https://www.reddit.com/r/haskell/comments/35vc31/the_real_way_to_generate_a_list_of_primes_in/
primes :: [Int]
primes = 2 : primes'
    where isPrime (p:ps) n = p*p > n || n `rem` p /= 0 && isPrime ps n
          primes' = 3 : filter (isPrime primes') [5, 7 ..]

digits :: Int -> Int -> [Int]
digits base num
    | num == 0  = [0]
    | otherwise = digits' num []
    where digits' :: Int -> [Int] -> [Int]
          digits' 0 acc    = acc
          digits' num acc = digits' (num `div` base) (num `mod` base : acc)

isPrime :: Int -> Bool
isPrime 1 = False
isPrime n = let root = floor $ sqrt $ fromIntegral n
                relevantPrimes = takeWhile (<= root) primes
            in  all (\p -> n `mod` p /= 0) relevantPrimes

isJoyNumber :: Int -> Bool
isJoyNumber n = let digitSum = sum (digits 10 n)
                    quotient = n `div` digitSum
                in  digitSum * quotient == n && isPrime quotient

main = do
  content <- readFile "input.txt"

  let numbers = map read (words =<< lines content)

  let joyNumbers = filter isJoyNumber numbers

  print . length $ joyNumbers

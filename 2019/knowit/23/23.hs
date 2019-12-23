import qualified Data.Set as S

-- Note: Digits are in reverse order
type Digits = [Int]

limit :: Int
limit = 98765432

primes :: S.Set Int
primes = S.fromAscList . takeWhile (<maxPrime) $ 2 : 3 : 5 : primes'
    where isPrime (p:ps) n = p*p > n || n `rem` p /= 0 && isPrime ps n
          primes' = 7 : filter (isPrime primes') (scanl (+) 11 $ cycle [2,4,2,4,6,2,6,4])
          maxPrime = (*9) . length . toDigits $ limit

toDigits :: Int -> Digits
toDigits 0 = []
toDigits n = n `mod` 10 : toDigits (n `div` 10)

digitSum :: Int -> Int
digitSum = sum . toDigits

isHarshad :: Int -> Bool
isHarshad n = let ds = digitSum n
              in  n `mod` ds == 0 && S.member ds primes

main =
    print
        . length
        . filter isHarshad
        $ [1..limit]

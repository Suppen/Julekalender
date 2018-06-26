isPrime :: [Int] -> Int -> Bool
isPrime (p:ps) n = p*p > n || n `rem` p /= 0 && isPrime ps n

primes :: [Int]
primes = 2:3:5:primes'
    where primes' = 7 : filter (isPrime primes') (scanl (+) 11 $ cycle [2,4,2,4,2,6,2,6])

reverseNum :: Int -> Int
reverseNum = read . reverse . show

isPalindrome :: Int -> Bool
isPalindrome n = n == reverseNum n

isMirp :: Int -> Bool
isMirp = do
    prime <- isPrime primes
    reversePrime <- isPrime primes . reverseNum
    palindrome <- isPalindrome
    return (prime && reversePrime && not palindrome)

main = do
    putStrLn $ show $ length $ filter isMirp [1..999]

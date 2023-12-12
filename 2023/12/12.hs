import Data.Char (chr, ord)
primes :: [Int]
primes = 2 : primes'
    where isPrime (p:ps) n = p*p > n || n `rem` p /= 0 && isPrime ps n
          primes' = 3 : filter (isPrime primes') [5, 7 ..]

twinPrimes :: [(Int, Int)]
twinPrimes = filter (\(a, b) -> b - a == 2) $ zip primes (tail primes)

x :: Int
x = length . takeWhile ((< (6^6 + 666)) . fst) $ twinPrimes

digits :: Int -> Int -> [Int]
digits base num
    | num == 0  = [0]
    | otherwise = digits' num []
    where digits' :: Int -> [Int] -> [Int]
          digits' 0 acc    = acc
          digits' num acc = digits' (num `div` base) (num `mod` base : acc)

ys :: [Int]
ys = filter ((== 0) . (`mod` 2) . sum . digits 2) [0..]

cipher :: String
cipher = "Ojfkyezkz bvclae zisj a guomiwly qr tmuematbcqxqv sa zmcgloz."

shiftLetter :: Int -> Char -> Char
shiftLetter n c
  | c `elem` ['a'..'z'] = chr $ ord 'a' + (ord c - ord 'a' + n) `mod` 26
  | c `elem` ['A'..'Z'] = chr $ ord 'A' + (ord c - ord 'A' + n) `mod` 26
  | otherwise           = c

rot13 :: String -> String
rot13 = map (shiftLetter 13)

key :: [Int]
key = map (x *) ys

decrypt :: String -> String
decrypt = zipWith shiftLetter (map negate key)

main = print $ decrypt cipher

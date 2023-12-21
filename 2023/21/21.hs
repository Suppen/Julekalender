import Data.List (splitAt)

digits :: Integer -> Integer -> [Integer]
digits base num
    | num == 0  = [0]
    | otherwise = digits' num []
    where digits' :: Integer -> [Integer] -> [Integer]
          digits' 0 acc    = acc
          digits' num acc = digits' (num `div` base) (num `mod` base : acc)

isValid :: Integer -> Bool
isValid cardNum = let (ds, [chk1, chk2]) = splitAt 22 $ digits 10 cardNum
                      checksum           = chk1 * 10 + chk2
                      s                  = sum . doubleEveryOther $ ds
                  in  checksum == ((24 - (s `mod` 24)) `mod` 24)
                  where doubleEveryOther :: [Integer] -> [Integer]
                        doubleEveryOther [] = []
                        doubleEveryOther (a:b:xs) = (a * 2) : b : doubleEveryOther xs


main = do
  cardNums <- map read . lines <$> readFile "kredittkort.txt"

  print . length . filter (not . isValid) $ cardNums

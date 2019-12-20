-- Note: Digits are in reverse order
type Digits = [Int]

toDigits :: Int -> Digits
toDigits 0 = []
toDigits n = n `mod` 10 : toDigits (n `div` 10)

fromDigits :: Digits -> Int
fromDigits ds = fromDigits' 0 ds
    where fromDigits' _ [] = 0
          fromDigits' n (d:ds) = d*10^n + fromDigits' (n+1) ds

isHiddenPalindrome :: Int -> Bool
isHiddenPalindrome n = isPalindrome (n + (fromDigits . reverse . toDigits $ n))

isPalindrome :: Int -> Bool
isPalindrome n = ds == reverse ds
    where ds = toDigits n

main =
    print
        . sum
        . filter (not . isPalindrome)
        . filter isHiddenPalindrome
        $ [1..123454321]

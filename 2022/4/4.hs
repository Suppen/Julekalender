digits :: Int -> Int -> [Int]
digits base num
    | num == 0  = [0]
    | otherwise = digits' num []
    where digits' :: Int -> [Int] -> [Int]
          digits' 0 acc    = acc
          digits' num acc = digits' (num `div` base) (num `mod` base : acc)

isPalindrome :: (Eq a) => [a] -> Bool
isPalindrome xs = xs == reverse xs

isMultiPalindrome :: Int -> Bool
isMultiPalindrome num =
    (== 3)
    . length
    . take 3
    . filter (isPalindrome)
    . map (flip digits num)
    $ [2..16]

main =
    print
    . sum
    . filter isMultiPalindrome
    $ [0..10000000]

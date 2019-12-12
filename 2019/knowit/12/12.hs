import Data.List (sort)

type Digits = [Int]

to4Digits :: Int -> Digits
to4Digits n = (replicate (4 - length digits) 0) ++ digits
    where digits = toDigits n

toDigits :: Int -> Digits
toDigits 0 = []
toDigits n = toDigits (n `div` 10) ++ [n `mod` 10]

fromDigits :: Digits -> Int
fromDigits ds = fromDigits' (length ds) ds
    where fromDigits' 0 _        = 0
          fromDigits' pow (d:ds) = d * 10^(pow-1) + fromDigits' (pow-1) ds

it :: Int -> Int
it =
    (\ds -> abs ((fromDigits . sort $ ds) - (fromDigits . reverse . sort $ ds)))
        . to4Digits

main =
    print
        . length
        . filter ((== 7) . length)
        . map (takeWhile (/= 6174) . iterate it)
        . filter ((flip notElem) [1111,2222..9999])
        $ [1000..9999]

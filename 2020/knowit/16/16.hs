divisors :: Int -> [Int]
divisors n =
    -- ...except the square root itself, if n is square. In which case, there are two copies of the root at the end of the resulting list. Remove one of them
    (\l -> if isSquare n then init l else l)
    -- All divisors come in pairs, with n/d1=d2 and n/d2=d1. d1 and d2 are on opposite sides of the square root
    . (>>= (\k -> [k, n `div` k]))
    -- Remove those which do not properly divide n
    . filter ((== 0) . (n `mod`))
    -- Make a list of numbers from 1 to square root of n
    $ [1..sn]
    where sn = floor . sqrt . fromIntegral $ n

isSquare :: Int -> Bool
isSquare n =
    (== n)
    . (^2)
    . floor
    . sqrt
    . fromIntegral
    $ n

main =
    print
    . length
    . filter isSquare
    . filter (/=0)
    . map (\n -> (sum . divisors $ n) - (2 * n))
    $ [1..999999]

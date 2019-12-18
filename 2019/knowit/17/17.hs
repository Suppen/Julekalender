triangle :: Int -> Int
triangle n = (n*(n+1)) `div` 2

triangles :: [Int]
triangles = map triangle [0..]

digitCount :: Int -> Int
digitCount n = (+1) . floor . logBase 10 . fromIntegral $ n

rotateDigits :: Int -> Int -> Int
rotateDigits d n = (n `mod` 10) * 10^(d-1) + (n `div` 10)

allRotations :: Int -> [Int]
allRotations n = allRotations' n dc
    where allRotations' n 0 = []
          allRotations' n c = n : allRotations' (rotateDigits dc n) (c-1)
          dc = digitCount n

isSquare :: Int -> Bool
isSquare n = (==n) . (^2) . floor . sqrt . fromIntegral $ n

main =
    print
        . length
        . filter (any isSquare . allRotations)
        . take 1000000
        $ triangles

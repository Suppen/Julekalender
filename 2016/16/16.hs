digitSum :: Int -> Int
digitSum n = recDigitSum n 0
    where recDigitSum 0 sum = sum
          recDigitSum n sum = recDigitSum (n `div` 10) (sum + (n `mod` 10))

digitSumIs43 :: Int -> Bool
digitSumIs43 n = digitSum n == 43

nroot :: Floating a => a -> a -> a
nroot n x = x ** (1/n)

isSquare :: Int -> Bool
isSquare n = m^2 == n
    where m = floor $ nroot 2 $ fromIntegral n

isCube :: Int -> Bool
isCube n = m^3 == n
    where m = floor $ nroot 3 $ fromIntegral n

isBelow500000 :: Int -> Bool
isBelow500000 = (<500000)

candidates :: [Int]
candidates = [a | a <- [1..], digitSumIs43 a]

isMagic :: Int -> Bool
isMagic n = trueConditions == 2
    where trueConditions = count True truthvalues
          truthvalues = [
              isSquare n,
              isCube n,
              isBelow500000 n
              ]
          count e l = foldl (\s b -> if b then s+1 else s) 0 l

main = putStrLn $ show $ head $ dropWhile (not . isMagic) candidates

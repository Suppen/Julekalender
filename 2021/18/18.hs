collatz :: Integer -> [Integer]
collatz n =
    (++ [1])
    . (n:)
    . takeWhile (> 1)
    . tail
    $ iterate fn n
    where fn :: Integer -> Integer
          fn n
              | even n = n `div` 2
              | odd n  = 3 * n + 1

niklatz :: Integer -> [Integer]
niklatz n =
    (++ [1])
    . (n:)
    . takeWhile (> 1)
    . map fst
    . tail
    $ iterate fn (n, nikFn n 0)
    where fn :: (Integer, Int) -> (Integer, Int)
          fn (n, nik)
              | (n37 || nik /= 0) && even n = (n * 3 + 1, nikFn n (nik-1))
              | (n37 || nik /= 0) && odd n  = (n `div` 2, nikFn n (nik-1))
              | even n                      = (n `div` 2, nikFn n 0)
              | odd n                       = (n * 3 + 1, nikFn n 0)
              where n37 = n `mod` 37 == 0
          nikFn :: Integer -> Int -> Int
          nikFn n remNik
              | n `mod` 37 == 0 = 2
              | otherwise       = remNik

badNiklatz :: Integer -> [Integer]
badNiklatz n =
    (++ [1])
    . (n:)
    . takeWhile (> 1)
    . map fst
    . tail
    $ iterate fn (n, nikFn n 0)
    where fn :: (Integer, Int) -> (Integer, Int)
          fn (n, nik)
              | nik /= 0 && even n = (n * 3 + 1, nikFn n (nik-1))
              | nik /= 0 && odd n  = (n `div` 2, nikFn n (nik-1))
              | even n                      = (n `div` 2, nikFn n 0)
              | odd n                       = (n * 3 + 1, nikFn n 0)
          nikFn :: Integer -> Int -> Int
          nikFn n remNik
              | n `mod` 37 == 0 = 2
              | otherwise       = remNik

main =
    print
    . sum
    . map (sum . snd)
    . filter (\(c, n) -> length c /= length n)
    $ [(collatz n, niklatz n) | n <- [1..1000000]]

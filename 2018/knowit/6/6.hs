isZeroHeavy :: Int -> Bool
isZeroHeavy n = isZeroHeavy' (0, n)
    where isZeroHeavy' (balance, 0) = balance > 0
          isZeroHeavy' (balance, n)
              | n `mod` 10 == 0 = isZeroHeavy' (balance+1, m)
              | otherwise       = isZeroHeavy' (balance-1, m)
              where m = n `div` 10

main = putStrLn
    . show
    . sum
    . filter isZeroHeavy
    $ [1..18163106]

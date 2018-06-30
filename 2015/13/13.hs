import Data.List (sort)

knalltall :: Integer -> [Integer]
knalltall max = do
    let maxSensiblePow = (\base val -> truncate $ logBase base $ fromIntegral val)

    fivePow <- [0..maxSensiblePow 5 max]
    let fiveProd = 5^fivePow

    threePow <- [0..maxSensiblePow 3 (max `div` fiveProd)]
    let threeProd = 3^threePow

    twoPow <- [0..maxSensiblePow 2 (max `div` (fiveProd * threeProd))]
    let twoProd = 2^twoPow

    return (fiveProd * threeProd * twoProd)

main = putStrLn $ show $ (!!9999) $ sort $ knalltall 900719925474099100

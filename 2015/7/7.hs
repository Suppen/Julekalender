main = do
    let nums = [a | a <- [0..1000], a `mod` 7 == 0, (read $ reverse $ show a) `mod` 7 == 0]
        s = sum nums
    putStrLn $ show s

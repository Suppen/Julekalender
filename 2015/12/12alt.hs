main = do
    putStrLn $ show $ solve (10^8) 7 0

solve max n sum
    | n > max = sum
    | n `mod` 5 == 0 = solve max (n+7) sum
    | otherwise = solve max (n+7) (sum+n)

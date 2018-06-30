main = do
    putStrLn $ show $ sum $ takeWhile (<100000000) $ scanl (+) 7 $ cycle [7, 7, 7, 14]

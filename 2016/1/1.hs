isMagic :: Int -> Bool
isMagic n =
        let ns = show n
            a = last ns : init ns
        in  read a == 4*n

main = putStrLn $ show $ head $ dropWhile (not . isMagic) [6,16..]

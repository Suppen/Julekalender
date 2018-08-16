list :: [Int]
list = 0 : 1 : 2 : 2 : makeRest 3
    where makeRest n = replicate (list !! n) n ++ makeRest (n+1)

main = putStrLn . show . sum . take 1000000 . drop 1 $ list

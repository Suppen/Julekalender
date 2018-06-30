trib :: [Integer]
trib = 1 : 1 : 2 : zipWith3 (\a b c -> a+b+c) trib (drop 1 trib) (drop 2 trib)

main = putStrLn $ show $ trib !! 30

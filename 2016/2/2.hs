fib :: [Integer]
fib = 1 : 1 : zipWith (+) fib (tail fib)

main = putStrLn $ show $ sum $ filter even $ takeWhile (<4*10^9) fib

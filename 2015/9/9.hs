alphabet :: [Char]
alphabet = ['A'..'Z']

solve :: Int -> String -> String
solve 0 acc = acc
solve num acc = let num1 = num-1
                    rest = num1 `mod` length alphabet 
                    num2 = (num1 - rest) `div` length alphabet
                in  solve num2 ((alphabet !! rest):acc)

main = do
    putStrLn $ solve 142453146368 []

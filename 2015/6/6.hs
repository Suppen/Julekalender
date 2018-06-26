combs :: Int -> Int -> Int
combs rem open
    | rem + open == 0     = 1
    | rem > 0 && open > 0 = a + b
    | rem > 0             = a
    | open > 0            = b
    where a = combs (rem-1) (open+1)
          b = combs rem (open-1)

main = do
    putStrLn $ show $ combs 13 0

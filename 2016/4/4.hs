nums :: [Int]
nums = stuff 1 1
    where stuff n m = if n `mod` 7 == 0 || '7' `elem` (show n)
                      then m : stuff (n+1) (m+1)
                      else n : stuff (n+1) m

weirdsum limit =
  let aux n r c
          | n > limit = r
          | c == 0 = aux (n+7) r 4
          | otherwise = aux (n+7) (r+n) (c-1)
  in aux 7 7 4

main = putStrLn $ show $ weirdsum 100000000

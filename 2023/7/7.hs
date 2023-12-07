import Data.List (isInfixOf)

solve :: Int -> Int -> String -> Int -> Int
solve upTo n s count
  | n == upTo            = count
  | show n `isInfixOf` s = solve upTo (n + 1) s count
  | otherwise            = solve upTo (n + 1) (s ++ show n) (count + 1)

main = print $ solve 100000 0 "" 0

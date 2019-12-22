import Data.List (transpose)

main =
    print
      . (\t -> (t `div` 5) * 200)
      . length
      . filter (/=' ')
      . concat
      . filter ((/=' ') . last)
      . transpose
      . lines
      =<< readFile "forest.txt"

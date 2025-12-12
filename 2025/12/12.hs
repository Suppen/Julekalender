-- countBamser :: Int -> [String] -> Int
-- countBamser n ("01000010":"01001010":xs) = countBamser (n+1) xs
-- countBamser n (_:xs) = countBamser n xs
-- countBamser n [] = n
--
-- main = do
--   content <- readFile "input.txt"
--
--   print . countBamser 0 . lines $ content

-- XXX: This makes absolutely no sense. The task is very ill defined. Nobody in the comment section understood how this
-- could be the answer either. Found by brute force
main = do
  content <- lines <$> readFile "input.txt"

  print . length . filter (`elem` ["01001010", "01010010"]) $ content

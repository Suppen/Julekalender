import Data.List (sortOn)

splitLine :: String -> [String]
splitLine [] = []
splitLine l = let (w, l') = break (== ',') l
              in  w : if null l then [] else splitLine (drop 1 l')

parseLine :: String -> (String, Int, Int, Int)
parseLine l = let [name, snill, slem, pepperkake] = splitLine l
              in  (name, read snill, read slem, read pepperkake)

parseFile :: String -> [(String, Int, Int, Int)]
parseFile = map parseLine . drop 1 . lines

calculateNiceness :: (String, Int, Int, Int) -> (String, Int)
calculateNiceness (name, snill, slem, pepperkake) = (name, snill * snillW + slem * slemW + pepperkake * pepperkakeW)
    where snillW = 50
          slemW = -25
          pepperkakeW = 15

main = do
  niceness <- map calculateNiceness <$> parseFile <$> readFile "input.txt"

  let sortedNiceness = sortOn snd niceness
      nicestThree = take 3 . reverse $ sortedNiceness
      baddestThree = reverse $ take 3 sortedNiceness

  print (concat [nicestThree, baddestThree])

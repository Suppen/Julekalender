readThrows :: FilePath -> IO [Int]
readThrows fileName = cycle . map read . lines <$> readFile fileName

type Throws = ([Int], [Int], [Int], [Int], [Int])

dagger :: Throws -> (Int, Throws)
dagger (d4:d4s, d61:d62:d6s, d8s, d10s, d20:d20s)
  | d20 + 8 >= 18 = (max d61 d62 + 2 + d4, hitTs)
  | otherwise     = (0, missTs)
  where hitTs  = (d4s, d6s, d8s, d10s, d20s)
        missTs = (d4:d4s, d61:d62:d6s, d8s, d10s, d20s)

sword :: Throws -> (Int, Throws)
sword (d4s, d6s, d8:d8s, d10s, d20:d20s)
  | d20 + 6 >= 18 = (d8 + 5, hitTs)
  | otherwise     = (0, missTs)
  where hitTs = (d4s, d6s, d8s, d10s, d20s)
        missTs = (d4s, d6s, d8:d8s, d10s, d20s)

axe :: Throws -> (Int, Throws)
axe (d4s, d6s, d8s, d101:d102:d10s, d20:d20s)
  | d20 + 3 >= 18 = (min d101 d102 + 6, hitTs)
  | otherwise     = (0, missTs)
  where hitTs = (d4s, d6s, d8s, d10s, d20s)
        missTs = (d4s, d6s, d8s, d101:d102:d10s, d20s)

type Attack = Throws -> (Int, Throws)

attacks :: [Attack]
attacks = cycle [dagger, sword, axe]

hitSanta :: [Attack] -> Throws -> [Int]
hitSanta (atk:atks) ts = let (dmg, ts') = atk ts
                         in  dmg : hitSanta atks ts'

main = do
  d4s  <- readThrows "d4.txt"
  d6s  <- readThrows "d6.txt"
  d8s  <- readThrows "d8.txt"
  d10s <- readThrows "d10.txt"
  d20s <- readThrows "d20.txt"

  print
    . length
    . takeWhile (> 0)
    . scanl (-) 10000000
    $ hitSanta attacks (d4s, d6s, d8s, d10s, d20s)

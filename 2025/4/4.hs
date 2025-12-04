import Debug.Trace (trace)

type State = (
    -- Remaining energy
    Int,
    -- Energy consumed on the moves
    [Int]
  )

normal :: Int
normal = 5

startingEnergy :: Int
startingEnergy = 3000

processPart :: Char -> State -> State
processPart _ s@(e, xs) | e <= 0 = s
processPart 'S' (e, xs)
  | e >= de = (e - de, de : xs)
  | otherwise = (0, xs)
  where de = normal
processPart 'B' (e, xs)
  | e >= de = (e - de, de : xs)
  | otherwise = (0, xs)
  where de = normal * 2
processPart 'D' (e, xs)
  | e >= de = (e - de, de : xs)
  | otherwise = (0, xs)
  where de = normal * 3
processPart 'I' (e, xs) = (e, 0 : xs)
processPart 'P' (e, xs@(a:b:_))
  | a > 0 && b > 0 = (e + a + b, -(a + b) : xs)
  | a > 0          = (e + a, -a : xs)
  | b > 0          = (e + b, -b : xs)
  | otherwise      = (e, 0 : xs)

solve :: String -> Int
solve =
  (* 10)
  . length
  . snd
  . (\x -> trace (show . sum . snd $ x) x)
  . foldl (flip processPart) (startingEnergy, [])

main = do
  track <- filter ((/=) '\n') <$> readFile "track.txt"

  print $ solve track

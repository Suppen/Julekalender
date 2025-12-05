import qualified Data.Map as M

data HoUnit = Ho | Hooo deriving (Read, Show, Eq, Ord)

letterMap :: M.Map [HoUnit] Char
letterMap = M.fromList [
    ([Ho], 'A'),
    ([Hooo, Ho, Ho, Ho], 'B'),
    ([Hooo, Ho, Hooo, Ho], 'C'),
    ([Hooo, Ho, Ho], 'D'),
    ([Ho], 'E'),
    ([Ho, Ho, Hooo, Ho], 'F'),
    ([Hooo, Hooo, Ho], 'G'),
    ([Ho, Ho, Ho, Ho], 'H'),
    ([Ho, Ho], 'I'),
    ([Ho, Hooo, Hooo, Hooo], 'J'),
    ([Hooo, Ho, Hooo], 'K'),
    ([Ho, Hooo, Ho, Ho], 'L'),
    ([Hooo, Hooo], 'M'),
    ([Ho, Hooo], 'N'),
    ([Hooo, Hooo, Hooo], 'O'),
    ([Ho, Hooo, Hooo, Ho], 'P'),
    ([Hooo, Hooo, Ho, Hooo], 'Q'),
    ([Ho, Hooo, Ho], 'R'),
    ([Ho, Ho, Ho], 'S'),
    ([Hooo], 'T'),
    ([Ho, Ho, Hooo], 'U'),
    ([Ho, Ho, Ho, Hooo], 'V'),
    ([Ho, Hooo, Hooo], 'W'),
    ([Hooo, Ho, Ho, Hooo], 'X'),
    ([Hooo, Ho, Hooo, Hooo], 'Y'),
    ([Hooo, Hooo, Ho, Ho], 'Z')
  ]

parseHos :: String -> [[HoUnit]]
parseHos = map (parseHos' []) . words
  where parseHos' acc [] = reverse acc
        parseHos' acc xs = let (w, rest) = break (== '_') xs
                           in  parseHos' (read w : acc) (drop 1 rest)

translate :: [[HoUnit]] -> Maybe String
translate = sequence . map (\k -> M.lookup k letterMap)

main = do
  hoCode <- parseHos <$> readFile "input.txt"

  print . translate $ hoCode

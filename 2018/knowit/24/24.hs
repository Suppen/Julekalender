import Data.Map.Strict (fromList, size, (!), Map)

target :: [Char]
target = "GODJULOGGODTNYTTÅR"

alphabet :: Map Char Integer
alphabet = fromList $ zip "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ" [1..]

alphabetLength :: Integer
alphabetLength = toInteger . size $ alphabet

solve :: [Char] -> Integer
solve chars = solve' chars 0
    where solve' :: [Char] -> Integer -> Integer
          solve' [] _ = 0
          solve' (x:xs) pos =
              (alphabet ! x) * (alphabetLength^pos) + (solve' xs (pos+1))

main = print . solve . reverse $ target

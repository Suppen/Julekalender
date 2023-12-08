import qualified Data.Map.Strict as M

type Key = M.Map Char Char

alphabet :: String
alphabet = ['a'..'z'] ++ ['æ', 'ø', 'å']

alphabetMap :: M.Map Int Char
alphabetMap = M.fromList $ zip [0..28] alphabet

parseEncKey :: [Int] -> M.Map Char Char
parseEncKey list = M.insert ',' ',' . M.fromList . zip alphabet $ map (alphabetMap M.!) list

parseEncKeys :: String -> [M.Map Char Char]
parseEncKeys = map (parseEncKey . read . init) . lines

flipKey :: Key -> Key
flipKey = M.fromList . map (\(a, b) -> (b, a)) . M.toList

decode :: String -> Key -> String
decode str encKey = map (flipKey encKey M.!) str

main = do
  keys <- parseEncKeys <$> readFile "input.txt"
  poemWords <- words <$> readFile "cipher.txt"

  let decodedWords = zipWith decode poemWords keys

  print decodedWords

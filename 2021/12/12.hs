import System.IO (readFile)

data Line = Kategori { level :: Int } | Gave { level :: Int } deriving (Show)

isKategori :: Line -> Bool
isKategori (Kategori _) = True
isKategori _ = False

parseLine :: String -> Line
parseLine line = let (dashes, (t:_)) = break (/= '-') line
                     level = length dashes
                 in  case t of 'K' -> Kategori level
                               'G' -> Gave level

removeEmptyCategories :: [Line] -> [Line]
removeEmptyCategories lines = rec lines []
    where rec [] acc = reverse acc
          rec (g@(Gave _):xs) acc = rec xs (g:acc)
          rec (a@(Kategori l) : b : xs) (a':acc)
              | level b <= l = rec (a':b:xs) acc
              | otherwise    = rec (b:xs) (a:a':acc)

main = do
    rawLines <- lines <$> readFile "task.txt"
    let lines = map parseLine rawLines

    print
        . length
        . filter isKategori
        . removeEmptyCategories
        $ lines

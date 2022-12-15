data Gift = Gift Int Int deriving (Show)
data Sack = Sack Int Int deriving (Show)

maxSackVolume :: Int
maxSackVolume = 120

maxSackValue :: Int
maxSackValue = 1700

parseData :: FilePath -> IO [Gift]
parseData filename =
    return
    . map (\(val, vol) -> Gift (read val) (read $ tail vol))
    . map (break (== ','))
    . tail
    . lines
    =<< readFile filename
    -- $ "value,volume\n600,30\n1000,40\n100,60\n1300,70\n1400,30\n200,100"

packSack' :: Sack -> [Gift] -> [Gift] -> [Gift]
packSack' _ acc [] = reverse acc
packSack' sack@(Sack sVal sVol) acc (g@(Gift gVal gVol):gs)
    | isFull    = reverse acc ++ (g:gs)
    | cantFit   = packSack' sack (g:acc) gs
    | otherwise = packSack' (Sack (sVal + gVal) (sVol + gVol)) acc gs
    where isFull  = maxSackValue == sVal || maxSackVolume == sVol
          cantFit = maxSackValue - sVal < gVal || maxSackVolume - sVol < gVol


packSack :: [Gift] -> [Gift]
packSack = packSack' (Sack 0 0) []

main =
    print
    . length
    . takeWhile (not . null)
    . iterate packSack
    =<< parseData "data.csv"

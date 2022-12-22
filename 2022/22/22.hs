import Data.List (transpose)

parseWaterLevel :: String -> [Int]
parseWaterLevel =
    map (length . dropWhile (== ' '))
    . transpose
    . lines

relativize :: [Int] -> [Ordering]
relativize []       = []
relativize (_:[])   = []
relativize (a:b:xs) = compare b a : relativize (b:xs)

parseWeather :: String -> [String]
parseWeather =
    map (tail . snd . break (== ','))
    . tail
    . lines

productionMap :: [((Ordering, String), Int)]
productionMap =
    [
      ((LT, "Mye regn"), 120000),
      ((LT, "Lite eller ingen regn"), 100000),
      ((EQ, "Mye regn"), 80000),
      ((EQ, "Lite eller ingen regn"), 60000),
      ((GT, "Mye regn"), 40000)
    ]

calculateProduction :: [Ordering] -> [String] -> Maybe Int
calculateProduction ords ws =
    fmap sum
    . sequence
    $ zipWith (\ord w -> lookup (ord, w) productionMap) ords ws

main = do
    relativeWaterLevels <- relativize . parseWaterLevel <$> readFile "vannstand.txt"
    weather <- parseWeather <$> readFile "vaer.csv"

    let answer = calculateProduction relativeWaterLevels weather

    print answer

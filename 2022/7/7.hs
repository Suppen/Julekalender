import Data.List (transpose)

digits :: Int -> Int -> [Int]
digits base num
    | num == 0  = [0]
    | otherwise = digits' num []
    where digits' :: Int -> [Int] -> [Int]
          digits' 0 acc    = acc
          digits' num acc = digits' (num `div` base) (num `mod` base : acc)

isEvil :: Int -> Bool
isEvil =
    even
    . length
    . filter (== 1)
    . digits 2

decrypt :: [[Int]] -> [String]
decrypt =
    map (map (\n -> if isEvil n then '1' else '0'))

parseEncrypted :: FilePath -> IO [[Int]]
parseEncrypted filename =
    return
    . map (map read)
    . map words
    . lines
    =<< readFile filename

main = do
    pixels <- decrypt <$> parseEncrypted "encrypted.txt"

    let h = length pixels
        w = length . head $ pixels

    writeFile "img.pbm" ("P1\n" ++ show w ++ " " ++ show h ++ "\n" ++ unlines pixels)

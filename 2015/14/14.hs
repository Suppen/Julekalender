import Data.Maybe (catMaybes, isJust)

flipDigit :: Char -> Maybe Char
flipDigit '0' = Just '0'
flipDigit '1' = Just '1'
flipDigit '6' = Just '9'
flipDigit '8' = Just '8'
flipDigit '9' = Just '6'
flipDigit _ = Nothing

flipNumber :: Int -> Maybe Int
flipNumber = fmap read . sequence . map flipDigit . reverse . show

solve :: Int -> Int
solve n = length $ filter (\(a, Just b) -> a == b) $ filter (isJust . snd) $ zip [0..n] $ map flipNumber [0..n]

main = putStrLn $ show $ solve 100000

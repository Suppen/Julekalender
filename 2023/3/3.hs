import System.IO (readFile)
import Data.List (sortBy)

parseInput :: String -> [[Int]]
parseInput = map (map read . words . map (\c -> if c == ',' then ' ' else c)) . lines

-- Makes a list of the best possible trades for each hour of the day
findBestTradesEachHour :: [Int] -> [(Int, Int)]
findBestTradesEachHour [] = []
findBestTradesEachHour [_] = []
findBestTradesEachHour (x:xs) = (x, maximum xs) : findBestTradesEachHour xs

-- Calculates the profit of a single trade
calculateTradeResult :: Int -> (Int, Int) -> Int
calculateTradeResult money (buy, sell) = let (shares, moneyLeft) = money `divMod` buy
                                         in moneyLeft + shares * sell

-- Calculates the best possible profit of a day
calculateBestDayResult :: Int -> [Int] -> Int
calculateBestDayResult money prices = maximum $ map (calculateTradeResult money) $ findBestTradesEachHour prices

-- Calculates the best possible profit of a list of days
calculateBestListResult :: Int -> [[Int]] -> [Int]
calculateBestListResult = scanl calculateBestDayResult

example :: String
example = "112,85,65,192,172,213\n165,146,188,102,119,156\n123,187,92,71,208,148"

--main = print . calculateBestListResult 1000 . parseInput $ example
main = print . calculateBestListResult 200000 . parseInput =<< readFile "input.txt"

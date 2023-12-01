import System.IO (readFile)

parseGoals :: String -> [Int]
parseGoals = map read . lines

parseBets :: String -> [(Int, Float)]
parseBets = map read . lines

solve :: Float -> Int -> [Int] -> [(Int, Float)] -> Int
solve innsatsprosent canes goals bets = foldl reducer canes (zip goals bets)
    where reducer canes (goal, (bet, odds))
            | goal < bet = canes - innsats
            | otherwise  = canes + round (fromIntegral innsats * odds)
            where innsats = round (fromIntegral canes * innsatsprosent)

startingCanes :: Int
startingCanes = 50000

main = do
    goals <- parseGoals <$> readFile "goals.txt"
    bets <- parseBets <$> readFile "bets.txt"

    let remainingCanes = solve 0.175 startingCanes goals bets

    print (startingCanes - remainingCanes)

import System.IO (readFile)
import Data.List (transpose, find)
import Data.Set (fromList, toList)
import Data.Maybe (isJust)

type Hour = Int
type Cost = Int

data Price = Price { dayHour :: Hour, cost :: Cost } deriving (Show)

parsePrices :: String -> [Price]
parsePrices =
    map (\(dayHour, cost) -> Price dayHour cost)
    . zip (cycle [1..24])
    . map (subtract 1 . length . dropWhile (== ' '))
    . transpose
    . lines

totalCostForHour :: [Price] -> Hour -> Cost
totalCostForHour prices hour =
    sum
    . map cost
    . filter ((== hour) . dayHour)
    $ prices

uniq :: (Ord a) => [a] -> [a]
uniq = toList . fromList

findCheapestHour :: [Price] -> Hour
findCheapestHour prices =
    let hours  = uniq . map dayHour $ prices
        totals = zip hours (totalCostForHour prices <$> hours)
        findCheapest cur@(_, total) next@(_, lowestTotal) = if total < lowestTotal then cur else next
    in  fst $ foldr1 findCheapest totals

strat1 :: [Price] -> [Price] -> Hour -> Cost
strat1 _ pricesNextYear cheapestHour = totalCostForHour pricesNextYear cheapestHour

strat2 :: [Price] -> [Price] -> Hour -> Cost
strat2 pricesPrevYear pricesNextYear cheapestHour =
    something pricesPrevYear pricesNextYear False 0
    where something :: [Price] -> [Price] -> Bool-> Cost -> Cost
          something (p1:ps) (n1:ns@(n2:_)) shouldSkip totalCost
              -- This is not the cheapest hour. Ignore it
              | dayHour p1 /= cheapestHour      = something' shouldSkip totalCost
              -- This is the last day of the year, and the elves worked double yesterday. All work is done!
              | not nextDayExists && shouldSkip = totalCost
              -- This is the last day of the year. The elves refuse to work more than one hour
              | not nextDayExists               = totalCost + cost n1
              -- The elves produced two hours yesterday. Skip this one
              | shouldSkip                      = something' False totalCost
              -- Producing at the same hour next day is more expensive. Produce twice now
              | cost nextDay > cost p1          = something' True (totalCost + cost n1 + cost n2)
              -- Procuding at the same hour next day is cheaper
              | otherwise                       = something' False (totalCost + cost n1)
              where maybeNextDay = find ((== cheapestHour) . dayHour) ps
                    nextDayExists = isJust maybeNextDay
                    (Just nextDay) = maybeNextDay
                    something' = something ps ns

main = do
    pricesPrevYear <- parsePrices <$> readFile "priser.txt"
    pricesNextYear <- parsePrices <$> readFile "priser-next.txt"

    let cheapestHour = findCheapestHour pricesPrevYear
        resultStrat1 = strat1 pricesPrevYear pricesNextYear cheapestHour
        resultStrat2 = strat2 pricesPrevYear pricesNextYear cheapestHour
        difference   = resultStrat2 - resultStrat1
        bestStrat    = if difference < 0 then 2 else 1

    print (show bestStrat ++ "," ++ show (abs difference))

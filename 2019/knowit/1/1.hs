import System.IO (readFile)
import Data.List.Split (splitOn)

type Day = Int
type DragonSize = Int
type Sheeps = Int
type DaysStarved = Int
type State = (Day, DragonSize, DaysStarved, Sheeps)

processDays :: State -> [Sheeps] -> Day
processDays (day, dragonSize, daysStarved, carriedSheeps) (sheeps:xsheeps)
    -- The dragon has starved 4 days in a row and will starve today too. Kill everyone
    | goBerserk      = day
    -- The dragon gets too little food and shrinks
    | not enoughFood = processDays (day + 1, dragonSize - 1, daysStarved + 1, 0) xsheeps
    -- The dragon gets enough food and grows
    | enoughFood     = processDays (day + 1, dragonSize + 1, 0, totalSheeps - dragonSize) xsheeps
    where totalSheeps = sheeps + carriedSheeps
          enoughFood  = totalSheeps >= dragonSize
          goBerserk   = daysStarved == 4 && not enoughFood

main = do
    content <- readFile "input.txt"
    print
        . processDays (0, 50, 0, 0)
        . map read
        . splitOn ","
        $ content
--        $ "50, 52, 52, 49, 50, 47, 45, 43, 50, 55"

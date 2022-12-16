import Data.Ratio ((%))

data State = State Integer Integer deriving (Show)

tripLength :: Integer
tripLength = 10^5

reindeerStamina :: Integer
reindeerStamina = 10^3

totalGifts :: Integer
totalGifts = 10^6

shifts :: Integer
shifts = tripLength `div` reindeerStamina

giftsPerShift :: Integer
giftsPerShift = totalGifts `div` shifts

deadWeight :: Integer
deadWeight = 1000 + 9000

reindeerWeight :: Integer
reindeerWeight = 1000;

giftWeight :: Integer
giftWeight = 1

reindeerThrust :: Integer
reindeerThrust = 2000

runShift :: State -> State
runShift (State shiftNo exhaustedReindeer) =
    State (shiftNo + 1) (exhaustedReindeer + freshReindeer)
    where freshReindeer = ceiling $ (
              exhaustedReindeer * reindeerWeight +
              deadWeight +
              ((shiftNo + 1) * giftsPerShift) * giftWeight
            ) % reindeerThrust

main =
    print
    . head
    . drop (fromInteger shifts)
    . iterate runShift
    $ State 0 0

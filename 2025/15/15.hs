import Control.Monad (filterM)
import Data.List (find, intercalate)
import qualified Data.Set as S

-- Found here: https://learnyouahaskell.github.io/for-a-few-monads-more.html#useful-monadic-functions
powerset :: [a] -> [[a]]
powerset xs = filterM (\x -> [True, False]) xs

allDays :: S.Set Int
allDays = S.fromList [1..24]

chocolateOnlyWeight :: Int
chocolateOnlyWeight = 167772150

mixedChockMockWeight :: Int
mixedChockMockWeight = 149848566

piecesForDay :: Int -> Int
piecesForDay day = 2 ^ (day-1)

weightForDay :: Int -> Int -> Int
weightForDay pieceWeight day = pieceWeight * piecesForDay day

-- The task specifying mockolate weighs 30% less than chocolate and using only integers kinda gives away that chocolate
-- weighs 10 mg, and mockolate 7 mg, but we'll calculate it anyway
chocolateWeight :: Int
chocolateWeight =
  (chocolateOnlyWeight `div`)
  . sum
  . S.map piecesForDay
  $ allDays

mockolateWeight :: Int
mockolateWeight = round $ (fromIntegral chocolateWeight) * (1.0 - 0.3)

mockolateDays :: (S.Set Int)
mockolateDays =
  (\(Just days) -> days)
  . find ((== mixedChockMockWeight) . totalWeight)
  . map S.fromList
  . powerset
  . S.toDescList
  $ allDays
  where totalWeight mockolateDays' =
          let chocolateDays        = allDays `S.difference` mockolateDays'
              totalChocolateWeight = sum $ S.map (weightForDay chocolateWeight) chocolateDays
              totalMockolateWeight = sum $ S.map (weightForDay mockolateWeight) mockolateDays'
          in  totalChocolateWeight + totalMockolateWeight

answer :: String
answer = ""
  ++ "SjokoladeMg:"
  ++ show chocolateWeight
  ++ ",MockuladeMg:"
  ++ show mockolateWeight
  ++ ",AntallMockulader:"
  ++ show (sum . S.map piecesForDay $ mockolateDays)
  ++ ",Luker:"
  ++ intercalate "," (map show . S.toAscList $ mockolateDays)

main = putStrLn answer

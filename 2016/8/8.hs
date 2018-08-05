import System.IO (readFile)
import qualified Data.Map.Strict as M
import Data.Maybe (fromJust, isJust)

type Player = Int
type Pos = Int
type Roll = Int

ladders :: M.Map Pos Pos
ladders = M.fromList [(3,17), (8,10), (15,44), (22,5), (39,56), (49,75), (62,45), (64,19), (65,73), (80,12), (87,79)]

goal :: Pos
goal = 90

move :: Pos -> Int -> (Pos,Int)
move pos n
    | isJust ladderPos = (fromJust ladderPos, 1)
    | otherwise        = (newPos, 0)
    where newPos = pos + n
          ladderPos = M.lookup newPos ladders

play :: Player -> M.Map Player Pos -> [Roll] -> Int -> Int
play 1338 positions rolls laddersUsed = play 1 positions rolls laddersUsed
play player positions (r:rs) laddersUsed
    | newPos == goal   = player * laddersUsed'
    | otherwise        = play (player+1) (M.adjust (return newPos) player positions) rs laddersUsed'
    where (newPos, l)  = move (fromJust $ M.lookup player positions) r
          laddersUsed' = laddersUsed + l

main = do
    contents <- readFile "terningkast.txt"
    putStrLn $ show $ play 1 (M.fromList $ zip [1..1337] (repeat 1)) (map read $ lines contents) 0

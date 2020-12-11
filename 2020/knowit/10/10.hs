import System.IO (readFile)
import Data.List (maximumBy)
import Data.List.Split (splitOn)
import qualified Data.Map.Strict as M

type Elf = String
type Points = Int

processInput :: String -> M.Map Elf Points
processInput =
    foldr countPoints M.empty
    . concat
    . map (zip [0..])
    . map reverse
    . map (splitOn ",")
    . lines
    where countPoints (points, elf) m
              | M.member elf m = M.adjust (+points) elf m
              | otherwise      = M.insert elf points m

determineWinner :: M.Map Elf Points -> (Elf, Points)
determineWinner =
    maximumBy (\(_, a) (_, b) -> a `compare` b)
    . M.toList

main =
    print
    . determineWinner
    . processInput
    =<< readFile "leker.txt"

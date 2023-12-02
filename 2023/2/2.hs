import Data.Char (isDigit)
import Data.Map qualified as M
import System.IO (readFile)

type PinNo = Int

type PinsOpen = M.Map PinNo Int

allLocked :: PinsOpen
allLocked = M.fromList $ map (,0) [1 .. 7]

parseLog :: String -> PinsOpen
parseLog = parseStates allLocked . filter (\c -> isDigit c || c == 'i' || c == 'a')
  where
    parseStates :: PinsOpen -> String -> PinsOpen
    parseStates pins [] = pins
    parseStates pins ('i' : n : xs) = parseStates (M.adjust (+ 1) (read [n]) pins) xs
    parseStates pins ('a' : n : xs) = parseStates (M.adjust (subtract 1) (read [n]) pins) xs

main = print . parseLog =<< readFile "log.txt"

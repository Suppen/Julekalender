import System.IO (readFile)
import Data.List.Split (splitOn)
import Data.Char (isAlphaNum)
import Data.Sequence (Seq, fromList, deleteAt, length, null, Seq ( (:|>), (:<|), Empty ))
import qualified Data.Map.Strict as M
import Data.List (maximumBy)
import Data.Function (on)

type Rule = Int
type RemainingSteps = Int
type StepsPerTurn = Int
type Elf = String
type Elves = Seq Elf
type Rule2Chair = Int
type State = (Rule2Chair, Rule, StepsPerTurn, RemainingSteps, Elves)

parseLine :: String -> State
parseLine =
    (\(rule:steps:elves) -> (0, read rule, read steps, read steps, fromList elves))
    . splitOn " "
    . filter (\c -> isAlphaNum c || c == ' ')

step :: State -> State
step (r2c, rule, spt, steps, elves :|> elf) = (r2c, rule, spt, steps-1, elf :<| elves)

takeAllSteps :: State -> State
takeAllSteps =
    head
    . dropWhile (\(_, _, _, steps, _) -> steps /= 0)
    . iterate step

removeChair :: State -> State
removeChair (r2c, 1, spt, _, elves) = (r2c,  1, spt, spt, deleteAt 0 elves)
removeChair (r2c, 2, spt, _, elves) = (r2c', 2, spt, spt, elves')
    where elves' = deleteAt r2c elves
          r2c'   = (r2c + 1) `mod` Data.Sequence.length elves'
removeChair (r2c, 4, spt, _, elves) = (r2c,  4, spt, spt, deleteAt (Data.Sequence.length elves - 1) elves)
removeChair (r2c, 3, spt, _, elves)
    | l == 2 = (r2c, 3, spt, spt, deleteAt 0 elves)
    | odd l  = (r2c, 3, spt, spt, deleteAt half elves)
    | even l = (r2c, 3, spt, spt, deleteAt (half-1) . deleteAt (half-1) $ elves)
    where l    = Data.Sequence.length elves
          half = (l `div` 2)

musicalChairsTurn :: State -> State
musicalChairsTurn state@(_, _, _, _, _ :<| Empty) = state
musicalChairsTurn state = removeChair . takeAllSteps $ state

musicalChairsRound :: State -> Elf
musicalChairsRound =
    (\(_, _, _, _, elf :<| Empty) -> elf)
    . head
    . dropWhile (\(_, _, _, _, _ :<| elves) -> not . Data.Sequence.null $ elves)
    . iterate musicalChairsTurn

main =
    print
    . maximumBy (compare `on` snd)
    . M.toList
    . foldr count M.empty
    . map musicalChairsRound
    . map parseLine
    . lines
    =<< readFile "input.txt"
    where count :: Elf -> M.Map Elf Int -> M.Map Elf Int
          count elf m
              | M.member elf m = M.adjust (+1) elf m
              | otherwise      = M.insert elf 1 m

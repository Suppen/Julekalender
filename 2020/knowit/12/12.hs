import System.IO (readFile)
import Data.Char (isLetter)
import qualified Data.Map.Strict as M
import Data.Maybe (isNothing)
import Data.List (maximumBy)

type Generation = Int
type Elves = Int

parse :: Generation -> String -> M.Map Generation Elves -> M.Map Generation Elves
parse _ [] m = m
parse gen str@(x:xs) m
    -- Initialize the generation in the map if it does not exist
    | isNothing (M.lookup gen m) = parse gen str (M.insert gen 0 m)
    -- Add the elf to the generation if the string now starts with a name
    | isLetter x                 = parse gen (dropWhile isLetter str) (M.adjust (+1) gen m)
    -- Ignore spaces
    | x == ' '                   = parse gen xs m
    -- Increase the generation on open paren
    | x == '('                   = parse (gen+1) xs m
    -- Decrease the generation number on close paren
    | x == ')'                   = parse (gen-1) xs m

main =
    print
    . maximumBy (\(_, a) (_, b) -> a `compare` b)
    . M.toList
    . flip (parse 0) M.empty
    =<< readFile "family.txt"

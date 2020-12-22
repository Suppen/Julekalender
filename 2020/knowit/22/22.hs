import System.IO
import Data.List.Split (splitOn)
import Data.Char (toLower, isLetter)
import Data.List (maximumBy)
import Data.Function (on)
import Data.Maybe (isJust)

type Gibberish = String
type Name = String

parseLine :: String -> (Gibberish, [Name])
parseLine line = let (gibberish:names) = splitOn " " line
                 in  (gibberish, names)

parseInput :: String -> [(Gibberish, [Name])]
parseInput =
    map parseLine
    . map (map toLower)
    . map (filter (\c -> isLetter c || c == ' '))
    . lines

findName :: Gibberish -> Name -> Gibberish -> Maybe Gibberish
findName gs [] acc         = Just (reverse acc ++ gs)
findName [] _ _            = Nothing
findName (g:gs) (n:ns) acc
    | g == n    = findName gs ns acc
    | otherwise = findName gs (n:ns) (g:acc)

processLine :: (Gibberish, [Name]) -> [Name]
processLine (_, [])      = []
processLine (gs, (n:ns)) =
    if   nameFound
    then n : processLine (gs', ns)
    else processLine (gs, ns)
    where result = findName gs n ""
          nameFound = isJust result
          (Just gs') = result

main =
    print
    . fst
    . maximumBy (compare `on` snd)
    . map (fmap length)
    . map (fmap processLine)
    . zip [0..]
    . parseInput
    =<< readFile "input.txt"

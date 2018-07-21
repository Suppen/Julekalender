import System.IO (readFile)
import Data.List (elemIndex)
import Data.Maybe (fromJust)
import Data.Char (chr, ord)

romans :: [String]
romans = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI"];

main = do
    contents <- readFile "kryptomelding.txt"
    let romanTokens = words $ filter ((/=) ',') $ tail $ init contents
        numTokens = map (fromJust . flip elemIndex romans) romanTokens
        cleartext = take (length numTokens `div` 2) $
                    map (chr . (+) (ord 'a' - 1)) $
                    zipWith (+) numTokens (reverse numTokens)
    putStrLn cleartext

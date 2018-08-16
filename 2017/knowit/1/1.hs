import qualified Data.Set as S
import Control.Monad (guard)
import Data.List (tails, sort)
import Text.Regex.Posix ((=~))
import System.IO (readFile)

-- | The scrambled word to find the original and n of
scrambledWord :: String
scrambledWord = "aeteesasrsssstaesersrrsse"

-- | Sorted version of the scrambled word
scrambledWordSorted :: String
scrambledWordSorted = sort scrambledWord

-- | Makes an n-gram of a word
makeNGram :: Int -> [a] -> [a]
makeNGram n word = concat
                   . take (length word - n + 1)
                   . map (take n)
                   . tails
                   $ word

-- | List of possible combinations of n and word length (n,l)
possibleValues :: (Int,Int)
possibleValues = head $ do
    l <- [1..length scrambledWord]
    n <- [1..l]
    guard $ n * (l - n + 1) == length scrambledWord
    return (n,l)

main = do
    contents <- readFile "wordlist.txt"
    let (n,l) = possibleValues
    let regexp = "^[" ++ (S.toList $ S.fromList scrambledWord)  ++ "]*$"
        solution = snd
                   . head
                   . filter ((== scrambledWordSorted) . sort . fst)
                   . map (\w -> (makeNGram n w, w))
                   . filter ((== l) . length)
                   . filter (flip (=~) regexp)
                   . words
                   $ contents
    putStrLn $ "Solution: " ++ show n ++ "-" ++ solution

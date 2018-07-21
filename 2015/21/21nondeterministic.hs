import System.IO (readFile)
import Data.Maybe (fromJust)
import Control.Monad (guard)
import Data.List (intercalate)
import qualified Data.Map.Strict as M

startWord :: String
startWord = "sand"

targetWord :: String
targetWord = "hold"

-- | Calculates how many chars are different in two words. Expects two words of length 4
wordDiff :: String -> String -> Int
wordDiff a b =
    let innerDiff [] _ diff = diff -- The words WILL be of same length (4 chars). Don't bother checking the second one
        innerDiff (a:as) (b:bs) diff
            | a == b    = innerDiff as bs diff
            | otherwise = innerDiff as bs (diff+1)
    in  innerDiff a b 0

-- | Finds words in a list which differs on one character from a given word
findNeighbourWords :: [String] -> String -> [String]
findNeighbourWords wordList word = filter ((==1) . wordDiff word) wordList

-- | Makes a map of neighbour words from a list of words
makeWordMap :: [String] -> M.Map String [String]
makeWordMap wordList = M.fromList $ map (\word -> (word, fnw word)) wordList
    where fnw = findNeighbourWords wordList

findPaths :: String -> String -> M.Map String [String] -> [[String]]
findPaths start target wordMap =
    let innerFindPath path@(word:_) target wordMap
            | word == target = return $ reverse path
            | otherwise = do
                guard ((length path) < 8)    -- I happen to know from the JS solution that the length is 8
                neighbour <- fromJust $ M.lookup word wordMap
                guard (not (neighbour `elem` path))
                innerFindPath (neighbour:path) target wordMap
    in  innerFindPath [start] target wordMap

main = do
    contents <- readFile "21.txt"
    let wordMap = makeWordMap $ startWord : lines contents
    mapM_ (putStrLn . show) $ findPaths startWord targetWord wordMap

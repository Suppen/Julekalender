import System.IO (readFile)
import Data.List.Split (splitOn)
import qualified Data.Map.Strict as M
import Data.Maybe (fromJust)

type Score = Int
type VowelCount = Int
type Rapword = String
type Baseword = String
type BasewordScores = M.Map Baseword Score
type Context = (VowelCount, [Baseword])

parseBattleLine :: String -> [Rapword]
parseBattleLine line = let (_:rest:[]) = splitOn ": " line
                       in  splitOn " " rest

parseBattle :: String -> [[Rapword]]
parseBattle = map parseBattleLine . lines

parseBasewords :: String -> BasewordScores
parseBasewords =
    M.fromList
    . map (fmap read)
    . map (break (== ' '))
    . lines

countVowels :: Rapword -> VowelCount
countVowels = length . filter (`elem` "aeiouyæøå")

hasJulePrefix :: Rapword -> Bool
hasJulePrefix = (== "jule") . take 4

getBaseword :: Rapword -> Baseword
getBaseword rapword
    | hasJulePrefix rapword = drop 4 rapword
    | otherwise             = rapword

getBasewordScore :: BasewordScores -> Baseword -> Score
getBasewordScore basewordScores baseword =
    -- XXX This will crash if the baseword is not in the map
    fromJust $ M.lookup baseword basewordScores

scoreWord :: BasewordScores -> Rapword -> Context -> (Score, Context)
scoreWord basewordScores rapword (prevVowels, prevWords@(prevWord:_)) =
    let baseword           = getBaseword rapword
        baseScore          = getBasewordScore basewordScores baseword
        vowels             = countVowels rapword
        vowelScore         = max 0 (vowels - prevVowels) * (if hasJulePrefix rapword then 2 else 1)
        isRepeatedBaseword = baseword == prevWord
        repetitionDivisor  = if isRepeatedBaseword then (length prevWords + 1) else 1
        score              = (baseScore + vowelScore) `div` repetitionDivisor
        nextPrevWordList   = baseword : (if isRepeatedBaseword then prevWords else [])
    in  (score, (vowels, nextPrevWordList))

scoreTurn :: BasewordScores -> [Rapword] -> Score
scoreTurn basewordScores rapwords = scoreTurn' basewordScores rapwords (0, (maxBound, [""]))
    where scoreTurn' :: BasewordScores -> [Rapword] -> (Score, Context) -> Score
          scoreTurn' _ [] (score, _) = score
          scoreTurn' basewordScores (r:rs) (score, context) =
              let (wordScore, newContext) = scoreWord basewordScores r context
              in  scoreTurn' basewordScores rs (score + wordScore, newContext)

scoreBattle :: BasewordScores -> [[Rapword]] -> [Score]
scoreBattle basewordScores battle =
    map (scoreTurn basewordScores) battle

main = do
    battle <- parseBattle <$> readFile "rap_battle.txt"
    basewordScores <- parseBasewords <$> readFile "basewords.txt"

    print . accScores (0, 0) $ scoreBattle basewordScores battle

    where accScores :: (Score, Score) -> [Score] -> (Score, Score)
          accScores scores [] = scores
          accScores (nizzyGScore, lilNizScore) (nizzyG:lilNiz:rest) =
              accScores (nizzyGScore + nizzyG, lilNizScore + lilNiz) rest

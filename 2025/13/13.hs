import Control.Monad
import Data.List (sort, sortOn)
import qualified Data.Set as S

-- Found here: https://learnyouahaskell.github.io/for-a-few-monads-more.html#useful-monadic-functions
powerset :: [a] -> [[a]]
powerset xs = filterM (\x -> [True, False]) xs

splitOn :: Char -> String -> [String]
splitOn c = splitOn' []
  where splitOn' acc [] = reverse acc
        splitOn' acc xs = let (w, rest) = break (== c) xs
                          in  splitOn' (w : acc) (drop 1 rest)

parseInput :: String -> (
        -- Time
        Int,
        -- Steps
        [(String, Int)],
        --Recipes
        [(String, Int, S.Set String)]
    )
parseInput input = let (('T':'=':rawTime):rest) = lines input
                       time = read rawTime
                       (rawSteps,(_:rawRecipes)) = break (== "---") rest
                       steps = map ((\(name:time:[]) -> (name, read time)) . splitOn ':') rawSteps
                       recipes = map ((\(name:time:steps) -> (name, read time, S.fromList steps)) . words) rawRecipes
                   in  (time, steps, recipes)

stepsWeHaveTimeFor :: Int -> [(String, Int)] -> [S.Set String]
stepsWeHaveTimeFor availableTime steps = map (S.fromList . map fst) $ filter filterFn (powerset steps)
  where filterFn steps = (<= availableTime) $ sum (map snd steps)

main = do
  (time, steps, recipes) <- parseInput <$> readFile "input.txt"

  let stepsWeHaveTimeFor' = stepsWeHaveTimeFor time steps
      recipesWeHaveTimeFor = map (map (\(name, happiness, _) -> (name, happiness))) . filter (not . null) $ map (\steps -> filter (\(_, _, recipeSteps) -> recipeSteps `S.isSubsetOf` steps) recipes) stepsWeHaveTimeFor'
      a = map (\l -> let totalHappiness = sum $ map snd l
                         allRecipeNames = sort $ map fst l
                     in  (totalHappiness, allRecipeNames)
              ) recipesWeHaveTimeFor

  print . head . reverse . sortOn fst $ a

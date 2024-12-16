import Control.Monad (mfilter)
import Data.Bifunctor (bimap)
import Data.Maybe (catMaybes, isJust, mapMaybe)

digitVal :: Char -> Maybe Int
digitVal 'J' = Just 10000
digitVal 'U' = Just 5000
digitVal 'L' = Just 1000
digitVal 'E' = Just 500
digitVal 'T' = Just 100
digitVal 'R' = Just 50
digitVal '3' = Just 10
digitVal 'V' = Just 5
digitVal 'I' = Just 1
digitVal _ = Nothing

parseOldRoman :: String -> Maybe Int
parseOldRoman =
  (=<<) (foldr (\group acc -> (+) <$> acc <*> mathTogetherGroup group) (Just 0))
    . mfilter validateGroups
    . fmap groupDigits
    . mapM digitVal
  where
    groupDigits :: [Int] -> [([Int], Maybe Int)]
    groupDigits [] = []
    groupDigits [d] = [([], Just d)]
    groupDigits ds = groupDigits' ds []
      where
        groupDigits' :: [Int] -> [Int] -> [([Int], Maybe Int)]
        groupDigits' [d] acc = [(reverse (d : acc), Nothing)]
        groupDigits' (d1 : d2 : ds) acc
          | d1 >= d2 = groupDigits' (d2 : ds) (d1 : acc)
          | any (>= d2) acc =
              let (gte, lt) = break (< d2) (reverse acc)
               in map (\d -> ([], Just d)) gte ++ groupDigits (lt ++ d1 : d2 : ds)
          | otherwise = (reverse (d1 : acc), Just d2) : groupDigits ds
    validateGroups :: [([Int], Maybe Int)] -> Bool
    validateGroups groups
      | any isJust . dropWhile isJust $ endDigits = False
      | otherwise = validateGroups' $ catMaybes endDigits
      where
        endDigits = map snd groups
        validateGroups' [] = True
        validateGroups' [_] = True
        validateGroups' (d1 : d2 : ds) = d1 >= d2 && validateGroups' ds
    mathTogetherGroup :: ([Int], Maybe Int) -> Maybe Int
    mathTogetherGroup (ds, Nothing) = Just (sum ds)
    mathTogetherGroup (ds, Just end) =
      let s = end - sum ds
       in if s < 0 then Nothing else Just s

main = do
  transactions <- lines <$> readFile "transaksjoner.txt"
  print (maximum $ map (\t -> (parseOldRoman t, t)) transactions)

import Data.List (sortOn, intercalate)

data Edge = Edge { from :: String, to :: String, time :: Int } deriving (Show, Eq)

parseEdge :: String -> Edge
parseEdge line = let [from, "->", to, time] = words line
                 in  Edge { from = from, to = to, time = read time }

parseInput :: String -> [Edge]
parseInput = map parseEdge . lines

findLoops :: [Edge] -> [[Edge]]
findLoops [] = []
findLoops edges@(start:_) = let (loop, (a:rest')) = break ((==) (from start) . to) edges
                            in  (loop ++ [a]) : findLoops rest'

totalWeight :: [Edge] -> Int
totalWeight = sum . map time

formatOutput :: (Int, [Edge]) -> String
formatOutput (weight, edges@(start:_)) = let edgesStr = intercalate " -> " (map from edges)
                                         in  edgesStr ++ " -> " ++ from start ++ " (" ++ show weight ++ ")"

main = do
  edges <- tail <$> parseInput <$> readFile "input.txt"

  let loops = map (\loop -> (totalWeight loop, loop)) $ findLoops edges

  putStrLn . formatOutput . head . sortOn fst $ loops

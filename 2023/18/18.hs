import Data.Maybe (mapMaybe)
import Data.List (transpose)

type Price = Int
type Amount = Int
type Graph = [(Price, Amount)]

parseGraph :: String -> Graph
parseGraph str = let ls        = lines str
                     isKOrS l  = if 'K' `elem` l || 'S' `elem` l then Just l else Nothing
                     rawPrices = mapMaybe isKOrS . transpose . init $ ls
                     prices    = map ((\rawPrice -> length rawPrice * if head rawPrice == 'S' then 1 else (-1)) . dropWhile (== ' ')) rawPrices
                     amounts   = map read . words . filter (/= ',') . last $ ls
                 in  zip prices amounts

processGraph :: Graph -> Int
processGraph = foldl (\acc (price, amount) -> acc + price * amount) 0

processGraphs :: [Graph] -> Int
processGraphs = sum . map processGraph

main = do
  graphs <- mapM (readFile . (\n -> "graphs/graph_" ++ show n ++ ".txt")) [1..10]

  print . processGraphs . map parseGraph $ graphs

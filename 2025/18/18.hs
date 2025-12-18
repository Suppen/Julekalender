import Data.List (find, findIndices, intercalate)
import qualified Data.Map as M
import qualified Data.Set as S

type Punchcard = String
type CharGrid = M.Map (Int, Int) Char

punchcardDimensions :: (Int, Int)
punchcardDimensions = (20, 10)

horizontalGap :: Int
horizontalGap = 3

verticalGap :: Int
verticalGap = 1

rectCoords :: (Int, Int) -> (Int, Int) -> [(Int, Int)]
rectCoords (x1, y1) (x2, y2) = [(x, y) | y <- [y1..y2], x <- [x1..x2]]

stringToCharGrid :: String -> CharGrid
stringToCharGrid =
  M.fromList
  . concatMap (\(y, row) ->
      map (\(x, c) -> ((x, y), c))
      . zip [0..]
      $ row
  )
  . zip [0..]
  . lines

charGridToPunchcards :: (Int, Int) -> Int -> Int -> CharGrid -> Maybe [Punchcard]
charGridToPunchcards (w, h) horizontalGap verticalGap grid =
  let maxX = maximum . map fst . M.keys $ grid
      maxY = maximum . map snd . M.keys $ grid
      topLeftCorners = [(x, y) | y <- [0, h + verticalGap .. maxY], x <- [0, w + horizontalGap .. maxX]]
      cardCoords = map (\(x, y) -> rectCoords (x, y) (x + w - 1, y + h - 1)) topLeftCorners
  in  sequence . map (sequence . map (\c -> M.lookup c grid)) $ cardCoords

main = do
  Just punchcards <-
      charGridToPunchcards punchcardDimensions horizontalGap verticalGap
      <$> stringToCharGrid
      <$> readFile "input.txt"


  let punchcardSet = S.fromList punchcards
      indicesPerPunchcard = S.toList $ S.map (\c -> map (+1) $ findIndices (== c) punchcards) punchcardSet
      code = fmap (intercalate "" . map show) . find ((> 1) . length) $ indicesPerPunchcard

  print code

import qualified Data.Set as S
import qualified Data.Map.Strict as M
import Data.Maybe (mapMaybe)

type Coord = (Int, Int)
data Stars = Stars {
    -- Map between current star position and original star position
    stars :: M.Map Coord Coord,
    -- Width of the sky
    width :: Int
} deriving (Show)
type Telescope = S.Set Coord

readPathFile :: FilePath -> IO [Coord]
readPathFile filePath =
  map (\l -> read ("(" ++ l ++ ")"))
  . lines
  <$> readFile filePath

readStars :: FilePath -> IO Stars
readStars filePath = do
  ls <- lines <$> readFile filePath

  let w     = length $ head ls
      stars =
          foldr (\(y, xs) stars -> foldr (\x stars -> M.insert (x, y) (x, y) stars) stars xs) M.empty
          . zip [0..]
          . map (
               map fst
               . filter ((== '*')
               . snd
          )
          . zip [0..])
          $ ls

  return $ Stars stars w

moveStars :: Stars -> Stars
moveStars (Stars stars w) =
  Stars (M.mapKeys (\(x, y) -> ((x - 1) `mod` w, y)) stars) w

makeTelescope :: Coord -> Telescope
makeTelescope center =
  foldr S.union S.empty [
    S.fromList [(x + cx, (-2) + cy) | x <- [-2..2]],
    S.fromList [(x + cx, (-1) + cy) | x <- [-4..4]],
    S.fromList [(x + cx, 0 + cy) | x <- [-5..5]],
    S.fromList [(x + cx, 1 + cy) | x <- [-4..4]],
    S.fromList [(x + cx, 2 + cy) | x <- [-2..2]]
  ]
  where
    (cx, cy) = center

observe :: Stars -> Telescope -> S.Set Coord
observe (Stars stars _) = S.fromList . mapMaybe (`M.lookup` stars) . S.toList

-- Makes a list of coordinates from one coordinate to another
-- Does not include the start coordinate
makePath :: Coord -> Coord -> [Coord]
makePath (startX, startY) (endX, endY)
  | dx == 0 && dy == 0 = []
  | dx == 0            = (startX, startY + signum dy) : makePath (startX, startY + signum dy) (endX, endY)
  | dy == 0            = (startX + signum dx, startY) : makePath (startX + signum dx, startY) (endX, endY)
  | otherwise          = error "Can only move orthogonally"
  where dx = endX - startX
        dy = endY - startY

makeFullPath :: [Coord] -> [Coord]
makeFullPath [] = []
makeFullPath [_] = []
makeFullPath (x:y:xs) = makePath x y ++ makeFullPath (y:xs)

main = do
  stars <- readStars "stars.txt"
  rawPath <- readPathFile "path.txt"

  let fullPath       = head rawPath : makeFullPath rawPath
      telescopeViews = map makeTelescope fullPath
      nightSky       = iterate moveStars stars
      observations   = zipWith observe nightSky telescopeViews
      observedStars  = foldl1 S.union observations

  print $ S.size observedStars

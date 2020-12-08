import System.IO (readFile)
import Data.List (dropWhile, iterate')
import Data.List.Split (splitOn)
import qualified Data.Map.Strict as M
import Data.Maybe (fromJust)

type Coords = (Int,Int)
type Time = Float
type WorldMap = M.Map String (Coords, Time)

parsePlace :: String -> (String, Coords)
parsePlace s = let (name:coords:_) = splitOn ":" s
               in  (name, read coords)

taxicabDistance :: Coords -> Coords -> Int
taxicabDistance (x1,y1) (x2,y2) = abs (x1 - x2) + abs (y1 - y2)

parseInputFile :: Int -> String -> IO (WorldMap, [String])
parseInputFile noOfPlaces filename = do
    contents <- readFile filename

    let fileLines       = lines contents
        (places, route) = splitAt noOfPlaces fileLines
        worldMap        = foldr (\(name, coords) m -> M.insert name (coords, 0) m) M.empty
                          . map parsePlace
                          $ places

    return (worldMap, route)

posOf :: String -> WorldMap -> Coords
posOf placeName worldMap = fst . fromJust $ M.lookup placeName worldMap

tick :: Coords -> WorldMap -> WorldMap
tick curPos worldMap = M.map (tick' curPos) worldMap
    where tick' curPos place@(placePos, placetime) = fmap (+deltaTime) place
              where distance = taxicabDistance curPos placePos
                    deltaTime
                        | distance == 0 = 0
                        | distance < 5  = 0.25
                        | distance < 20 = 0.5
                        | distance < 50 = 0.75
                        | otherwise     = 1

moveSanta :: Coords -> Coords -> Coords
moveSanta (x1, y1) (x2, y2)
    | dx /= 0   = (x1 + dx, y1)
    | otherwise = (x1, y1 + dy)
    where dx = signum (x2 - x1)
          dy = signum (y2 - y1)

step :: (Coords, [String], WorldMap) -> (Coords, [String], WorldMap)
step tup@(_, [], _) = tup
step (curPos, fullRoute@(dstName : restRoute), worldMap) =
    let dstPos      = posOf dstName worldMap
        newPos      = moveSanta curPos dstPos
        newRoute    = if newPos == dstPos then restRoute else fullRoute
        newWorldMap = tick newPos worldMap
    in  (newPos, newRoute, newWorldMap)

getBiggestTimeDifference :: WorldMap -> Float
getBiggestTimeDifference worldMap =
    let timestamps = map snd . M.elems $ worldMap
        minTs      = minimum timestamps
        maxTs      = maximum timestamps
    in  maxTs - minTs

main =
    print
    . getBiggestTimeDifference
    . (\(_, _, worldMap) -> worldMap)
    . head
    . dropWhile (\(_, route, _) -> route /= [])
    . iterate' step
    . (\(worldMap, route) -> ((0, 0), route, worldMap))
    =<< parseInputFile 50 "input.txt"

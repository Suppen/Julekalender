-- Lots of code here is stolen from https://rosettacode.org/wiki/Haversine_formula#Haskell
import System.IO (readFile)
import Data.Bifunctor (bimap)
import Data.Char (isDigit)
import qualified Data.Set as S

type Point = (Double, Double)

earthRadius :: Double
earthRadius = 6371

northPole :: Point
northPole = (deg2rad 0, deg2rad 90)

deg2rad :: Double -> Double
deg2rad = (/ 180) . (pi *)

distanceBetween :: Point -> Point -> Double
distanceBetween (lon1, lat1) (lon2, lat2) =
    (2 * earthRadius)
        * asin
            ( min
                1.0
                ( sqrt $
                    haversine (lat2 - lat1)
                        + ( (cos lat1 * cos lat2 )
                            * haversine (lon2 - lon1)
                          )
               )
            )
    where haversine :: Double -> Double
          haversine = (^ 2) . sin . (/ 2)

findClosestUnvisited :: Point -> S.Set Point -> Point
findClosestUnvisited p unvisited =
    snd
    . S.foldr' something (10000000000, (10000000000, 10000000000))
    $ unvisited
    where something :: Point -> (Double, Point) -> (Double, Point)
          something currentP (dist, closestP) =
              if newDist < dist
                  then (newDist, currentP)
                  else (dist, closestP)
              where newDist = distanceBetween p currentP


parsePoints :: String -> S.Set Point
parsePoints =
    S.fromList
    -- Process each line
    . map (
        -- Math works best on radians
        bimap deg2rad deg2rad
        -- Read them as numbers
        . bimap read read
        -- Split the coordinates
        . fmap tail
        . break (== ' ')
        -- Ignore evertything but the coordinates
        . tail
        . init
        . dropWhile (/= '(')
      )
    -- Ignore the header
    . tail
    -- Split it into lines
    . lines

findPath :: Point -> S.Set Point -> [Point]
findPath currentPoint unvisited
    | S.null unvisited = currentPoint : northPole : [] -- Hacking north pole in at the end of the list here, as it was simplest
    | otherwise        = let closestUnvisited = findClosestUnvisited currentPoint unvisited
                         in  currentPoint : findPath closestUnvisited (S.delete closestUnvisited unvisited)

pathDistance :: Double -> [Point] -> Double
pathDistance acc [] = acc
pathDistance acc (x:[]) = acc
pathDistance acc (a:b:xs) = pathDistance (acc + distanceBetween a b) (b:xs)

main = do
    csv <- readFile "cities.modified.csv"
    let cities = parsePoints csv
        distance = pathDistance 0 . findPath northPole $ cities

    print (round distance)

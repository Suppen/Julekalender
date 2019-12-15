import System.IO (readFile)
import Data.List.Split

type Point = (Double, Double, Double)
type Triangle = (Point, Point, Point)
type Model = [Triangle]

a :: [[(Int)]] -> [[(Int)]]
a = id

sideLength :: Point -> Point -> Double
sideLength (a1, b1, c1) (a2, b2, c2) =
    sqrt ((a1 - a2)^2 + (b1 - b2)^2 + (c1 - c2)^2)

triangleArea :: Triangle -> Double
triangleArea (pa, pb, pc) = let a = sideLength pa pb
                                b = sideLength pb pc
                                c = sideLength pc pa
                                s = (a + b + c) / 2
                            in  sqrt (s*(s-a)*(s-b)*(s-c))

csvToModel :: String -> Model
csvToModel =
    map (\([a, b, c]) -> (a, b, c))
        . map (map (\([a, b, c]) -> (read a, read b, read c)))
        . map (chunksOf 3)
        . map (splitOn ",")
        . lines

getFootprint :: Model -> Double
getFootprint = 
    foldr (\t a -> a + triangleArea t) 0
        . filter (\((_, _, z1), (_, _, z2), (_, _, z3)) -> z1 == 0 && z2 == 0 && z3 == 0)

getHeight :: Model -> Double
getHeight = 
    maximum
        . map (\((_, _, z1), (_, _, z2), (_, _, z3)) -> maximum [z1, z2, z3])

main =
    print
        . (\m -> let footprint = getFootprint m
                     height    = getHeight m
                 in  (footprint * height) / 1000)
        . csvToModel
        =<< readFile "input.txt"

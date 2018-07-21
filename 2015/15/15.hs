import Data.List (intercalate)

type TreasureMap = [[String]]
type Path = [String]
type Coordinates = String

treasureMap :: TreasureMap
treasureMap = [[],
    ["", "34", "21", "32", "41", "25"],
    ["", "14", "42", "43", "14", "31"],
    ["", "54", "45", "52", "42", "23"],
    ["", "33", "15", "51", "31", "35"],
    ["", "21", "52", "33", "13", "23"]
    ]

findTreasure :: TreasureMap -> Coordinates -> Path -> Path
findTreasure treasureMap coord@(row:col:_) path = let nextCoord@(nextRow:nextCol:_) = treasureMap !! read [row] !! read [col]
                                                  in  if coord == nextCoord
                                                      then reverse (nextCoord:path)
                                                      else findTreasure treasureMap nextCoord (coord:path)

solve :: TreasureMap -> Coordinates -> String
solve treasureMap startCoords = intercalate ", " $ findTreasure treasureMap startCoords []

main = putStrLn $ solve treasureMap "11"

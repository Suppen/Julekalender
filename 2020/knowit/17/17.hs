import System.IO (readFile)
import qualified Data.Map.Strict as M

type Coords = (Int, Int)
type Footprint = [Coords]
type Cleaned = Bool
type HouseMap = M.Map Coords Cleaned

makeGrid :: String -> [(Int, Int, Char)]
makeGrid = (>>= (\(lNo, line) -> map (\(cNo, c) -> (lNo, cNo, c)) line))
           . zip [0..]
           . map (zip [0..])
           . lines

getFootprint :: String -> Footprint
getFootprint shape =
    let grid               = filter (\(_, _, c) -> c /= ' ')
                             . makeGrid
                             $ shape
        (centerX, centerY) = (\(x, y, _) -> (x, y))
                             . head
                             . dropWhile (\(_, _, c) -> c /= 'X')
                             $ grid
    in  map (\(x, y, _) -> (x - centerX, y - centerY)) grid

roombaFootprint :: Footprint
roombaFootprint = getFootprint
    "  sss\n\
    \ sssss\n\
    \sssssss\n\
    \sssXsss\n\
    \sssssss\n\
    \ sssss\n\
    \  sss"

roombaBrushFootprint :: Footprint
roombaBrushFootprint = getFootprint
    "kkk   kkk\n\
    \kkkkkkkkk\n\
    \kkkkkkkkk\n\
    \ kkkkkkk\n\
    \ kkkXkkk\n\
    \ kkkkkkk\n\
    \kkkkkkkkk\n\
    \kkkkkkkkk\n\
    \kkk   kkk"

getOffsetCoords :: Coords -> Footprint -> Footprint
getOffsetCoords (x, y) = map (\(dx, dy) -> (x + dx, y + dy))

exampleHouseMap :: HouseMap
exampleHouseMap = makeHouseMap
    "xxxxxxxxxxxxxxxxxxxx\n\
    \x ..x.ssssss...  x x\n\
    \x.xxxssssssss..  xxx\n\
    \x..sssssssssss  x  x\n\
    \x.ssssssssssss     x\n\
    \xsssssssssssss     x\n\
    \xssssssssssssxx    x\n\
    \xssssssssssssxx    x\n\
    \xssssssssssssxx    x\n\
    \x.sssssssssssxx    x\n\
    \x..ssssssssssxx    x\n\
    \xxxxxxsssssssxx    x\n\
    \x  ..ssssssss.     x\n\
    \x   sssssssss.     x\n\
    \x   ssssssss..     x\n\
    \x   sssssss...     x\n\
    \x  ..sssssxxxxxxxxxx\n\
    \x  ..xsssxxxxx     x\n\
    \x  ...   ...       x\n\
    \xxxxxxxxxxxxxxxxxxxx"

makeHouseMap :: String -> HouseMap
makeHouseMap =
    foldr (\(x, y, _) m -> M.insert (x, y) False m) M.empty
    . filter (\(_, _, c) -> c /= 'x')
    . makeGrid

roombaFits :: Footprint -> HouseMap -> Coords -> Bool
roombaFits roomba house coords =
    all (flip M.member house)
    . getOffsetCoords coords
    $ roomba

cleanSpot :: Footprint -> Footprint -> Coords -> HouseMap -> HouseMap
cleanSpot roomba brushes coords house
    | roombaFits roomba house coords = clean' brushes house coords
    | otherwise                      = house
    where clean' :: Footprint -> HouseMap -> Coords -> HouseMap
          clean' brushes house coords =
              foldr (\coords m -> M.adjust (\_ -> True) coords m) house
              . getOffsetCoords coords
              $ brushes

cleanHouse :: Footprint -> Footprint -> HouseMap -> HouseMap
cleanHouse roomba brushes house =
    foldr (\coords m -> cleanSpot roomba brushes coords m) house
    . M.keys
    $ house


main =
    print
    . length
    . M.filter (not . id)
    . cleanHouse roombaFootprint roombaBrushFootprint
    . makeHouseMap
    =<< readFile "kart.txt"

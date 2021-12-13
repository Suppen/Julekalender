import System.IO (readFile)
import qualified Data.Map.Strict as M
import Data.Ix (range)
import Data.Maybe (fromJust)

type X = Int
type Y = Int
type Z = Int
type Coord = (X, Y)
type Chimney = M.Map Coord Z

data Gift = Gift { z :: Z, pos :: Coord } deriving (Show)

chimneyHeight :: Z
chimneyHeight = 250

chimneyOpeningPos :: Coord
chimneyOpeningPos = (4, 4)

emptyChimney :: Chimney
emptyChimney =
    M.fromList
    $ zip (range ((0,0),(8,8))) (repeat 0)

newlyDroppedGift :: Gift
newlyDroppedGift = Gift (chimneyHeight+1) chimneyOpeningPos

north :: Coord -> Coord
north (x, y) = (x, y+1)

south :: Coord -> Coord
south (x, y) = (x, y-1)

east :: Coord -> Coord
east (x, y) = (x+1, y)

west :: Coord -> Coord
west (x, y) = (x-1, y)

tryMove :: Char -> Chimney -> Gift -> Gift
tryMove 'I' chimney gift@(Gift _ pos) = tryMove' chimney pos gift
tryMove 'N' chimney gift@(Gift _ pos) = tryMove' chimney (north pos) gift
tryMove 'S' chimney gift@(Gift _ pos) = tryMove' chimney (south pos) gift
tryMove 'E' chimney gift@(Gift _ pos) = tryMove' chimney (east pos) gift
tryMove 'W' chimney gift@(Gift _ pos) = tryMove' chimney (west pos) gift

tryMove' :: Chimney -> Coord -> Gift -> Gift
tryMove' chimney newPos gift@(Gift z pos) =
    case M.lookup newPos chimney of Nothing  -> gift
                                    (Just h) -> if z > h then Gift z newPos
                                                         else gift

hasLanded :: Chimney -> Gift -> Bool
hasLanded chimney (Gift z pos) =
    ((>= z) . (+1))
    . fromJust -- If it's a nothing, the gift is outside the chimney, which is an error
    $ M.lookup pos chimney

addToChimney :: Gift -> Chimney -> Chimney
addToChimney (Gift _ pos) chimney = M.adjust (+1) pos chimney

processGift :: Chimney -> Gift -> [Char] -> Chimney
processGift chimney gift [] = addToChimney gift chimney
processGift chimney (Gift z pos) (d:ds) =
    (\g -> if   hasLanded chimney g
           then addToChimney g chimney
           else processGift chimney g ds
    )
    -- Try to move it to its new position
    . tryMove d chimney
    -- Drop the gift down one level
    $ (Gift (z-1) pos)

main =
    print
    . (*10)
    . maximum
    . map snd
    . M.toList
    . foldl (\chimney directions -> processGift chimney newlyDroppedGift directions) emptyChimney
    . lines
    =<< readFile "moves.txt"

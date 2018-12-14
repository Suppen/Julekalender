import System.IO (readFile)
import qualified Data.Set as S

type Coords = (Int,Int)
type Direction = Char

walk :: String -> S.Set Coords
walk = walk' ((0,0), S.empty)
    where walk' :: (Coords, S.Set Coords) -> String -> S.Set Coords
          walk' (pos, visited) [] = S.insert pos visited
          walk' (pos, visited) (n:d:rest) = walk' (newPos, visited') rest
              where (newPos, track) = stroll (read [n]) d pos []
                    visited' = foldr S.insert visited track
          stroll :: Int -> Direction -> Coords -> [Coords] -> (Coords, [Coords])
          stroll n d pos@(x,y) track
              | n == 0   = (pos, track)
              | d == 'H' = stroll (n-1) d (x+1,y) track'
              | d == 'V' = stroll (n-1) d (x-1,y) track'
              | d == 'F' = stroll (n-1) d (x,y+1) track'
              | d == 'B' = stroll (n-1) d (x,y-1) track'
              where track' = pos : track

solve :: S.Set Coords -> Double
solve s =
    let minX = minimum . map fst . S.toList $ s
        maxX = maximum . map fst . S.toList $ s
        minY = minimum . map snd . S.toList $ s
        maxY = maximum . map snd . S.toList $ s
        visited = S.size s
        unvisited =  (maxX - minX + 1) * (maxY - minY + 1) - visited
    in  fromIntegral visited / fromIntegral unvisited

main = do
    content <- readFile "input.txt"
    print
        . solve
        . walk
        . filter (/= '\n')
        $ content

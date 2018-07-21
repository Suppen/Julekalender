import System.IO (readFile)

type Pos = (Int,Int)

walk :: Pos -> String -> Int -> Pos
walk (x,y) "north" m = (x,y+m)
walk (x,y) "south" m = (x,y-m)
walk (x,y) "east" m = (x-m,y)
walk (x,y) "west" m = (x+m,y)

foldFunc :: Pos -> String -> Pos
foldFunc pos line = walk pos direction (read meters)
    where [_, meters, _, direction] = words line

main = do
    contents <- readFile "skattekart.txt"
    let (x,y) = foldl foldFunc (0,0) $ lines contents
    putStrLn (show y ++ "," ++ show x)

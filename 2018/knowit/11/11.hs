import System.IO (readFile)

walk :: String -> (Int,Int)
walk path = walk' path (0,0)
    where walk' [] c = c
          walk' ('\n':xs) c = walk' xs c
          walk' (n:d:rest) (x,y)
              | d == 'H' = walk' rest (x+n',y)
              | d == 'V' = walk' rest (x-n',y)
              | d == 'F' = walk' rest (x,y+n')
              | d == 'B' = walk' rest (x,y-n')
              where n' = read [n]

main = do
    content <- readFile "input.txt"
    putStrLn
        . (\(x,y) -> "[" ++ show x ++ "," ++ show y ++ "]")
        . walk
        $ content

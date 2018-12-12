import System.IO (readFile)
import Data.List (foldl')

type Stack = [Int]

compile :: String -> Stack -> Stack
compile =
    foldl' (flip (.)) id
      . map toFunc
      . concat
      . map (takeWhile (/= 'K'))
      . lines
    where toFunc c
              | c == ':' = \s -> [sum s]
              | c == '|' = \s -> 3 : s
              | c == '\'' = \(x:y:ys) -> x+y : ys
              | c == '.' = \(a:b:bs) -> b-a : a-b : bs
              | c == '_' = \(a:b:bs) -> a : a*b : bs
              | c == '/' = tail
              | c == 'i' = \(x:xs) -> x : x : xs
              | c == '\\' = \(x:xs) -> x+1 : xs
--              | c == '*' = \(a:b:bs) -> truncate (a/b) : bs
              | c == '*' = star
              | c == ']' = \(x:xs) -> if x `mod` 2 == 0 then 1 : xs else xs
              | c == '[' = \(x:xs) -> if x `mod` 2 == 1 then x : xs else xs
              | c == '~' = \(x:y:z:zs) -> maximum [x,y,z] : zs
              | c == ' ' = \s -> 31 : s
          star (a:b:bs)
              | res < 0   = res+1 : bs
              | otherwise = res : bs
              where res = a `div` b

-- Main
main = do
    content <- readFile "input.spp"
    print
        . maximum
        . compile content
        $ []

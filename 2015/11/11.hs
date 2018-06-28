import System.IO
import Data.Char
import Data.List

parseRoman :: String -> Int
parseRoman roman = innerParseRoman roman 0
    where innerParseRoman [] acc           = acc
          innerParseRoman ('M':xs) acc     = innerParseRoman xs (acc+1000)
          innerParseRoman ('C':'M':xs) acc = innerParseRoman xs (acc+900)
          innerParseRoman ('D':xs) acc     = innerParseRoman xs (acc+500)
          innerParseRoman ('C':'D':xs) acc = innerParseRoman xs (acc+400)
          innerParseRoman ('C':xs) acc     = innerParseRoman xs (acc+100)
          innerParseRoman ('X':'C':xs) acc = innerParseRoman xs (acc+90)
          innerParseRoman ('L':xs) acc     = innerParseRoman xs (acc+50)
          innerParseRoman ('X':'L':xs) acc = innerParseRoman xs (acc+40)
          innerParseRoman ('X':xs) acc     = innerParseRoman xs (acc+10)
          innerParseRoman ('I':'X':xs) acc = innerParseRoman xs (acc+9)
          innerParseRoman ('V':xs) acc     = innerParseRoman xs (acc+5)
          innerParseRoman ('I':'V':xs) acc = innerParseRoman xs (acc+4)
          innerParseRoman ('I':xs) acc     = innerParseRoman xs (acc+1)

parseBinary :: String -> Int
parseBinary bin = innerParseBinary (reverse bin) 0 0
    where innerParseBinary [] _ acc         = acc
          innerParseBinary ('0':xs) pow acc = innerParseBinary xs (pow+1) acc
          innerParseBinary ('1':xs) pow acc = innerParseBinary xs (pow+1) (acc + 2^pow)
          innerParseBinary (x:_) _ _ = error $ show $ ord x

parseLine :: (Int,String) -> (Int,Int)
parseLine (i, '0':'b':xs) = (i, parseBinary xs)
parseLine (i, num@(x:_)) = if isLetter x
                           then (i, parseRoman num)
                           else (i, read num)

main = do
    contents <- readFile "11.txt"
    let nums = zip [0..] $ lines contents
        parsedNums = map parseLine nums
        sorted = sortBy (\(_, num1) (_, num2) -> num1 `compare` num2) parsedNums
        middleIndex = (length sorted) `div` 2
        (originalIndex, _) = sorted !! middleIndex
        (_, num) = nums !! originalIndex
    putStrLn $ num
        
        

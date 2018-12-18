import System.IO (readFile)

type Points = (Int,Int,Int)
type Contenders = (Bool,Bool,Bool)

beats :: Char -> Char -> Bool
'S' `beats` 'P' = True
'P' `beats` 'R' = True
'R' `beats` 'S' = True
_ `beats` _ = False

solve :: String -> Points
solve = solveThree (0,0,0)

solveThree :: Points -> String -> Points
solveThree points [] = points
solveThree points@(ap,bp,cp) (a:b:c:xs)
    -- All equal; rematch
    | a == b && b == c           = solveThree points xs
    -- All different; rematch
    | a /= b && b /= c && c /= a = solveThree points xs
    -- Alice wins
    | a `beats` b && a `beats` c = solveThree (ap+1, bp, cp) xs
    -- Bob wins
    | b `beats` a && b `beats` c = solveThree (ap, bp+1, cp) xs
    -- Charlie wins
    | c `beats` a && c `beats` b = solveThree (ap, bp, cp+1) xs
    -- Alice is eliminated
    | b `beats` a && c `beats` a = solveTwo points xs (False,True,True)
    -- Bob is eliminated
    | a `beats` b && c `beats` b = solveTwo points xs (True,False,True)
    -- Charlie is eliminated
    | a `beats` c && b `beats` c = solveTwo points xs (True,True,False)

solveTwo :: Points -> String -> Contenders -> Points
solveTwo points@(ap,bp,cp) (x:y:ys) contenders
    -- Both equal. Rematch
    | x == y      = solveTwo points ys contenders
    -- One beats the other
    | x `beats` y = solveThree (awardPoints contenders 0 points) ys
    -- The other beats one
    | y `beats` x = solveThree (awardPoints contenders 1 points) ys
    where awardPoints :: Contenders -> Int -> Points -> Points
          awardPoints (a,b,c) player (ap,bp,cp)
              | player == 0 && a = (ap+1, bp, cp)
              | player == 1 && c = (ap, bp, cp+1)
              | otherwise        = (ap, bp+1, cp)

main = do
    content <- readFile "input.txt"
    putStrLn
        . (\(a,b,c) -> show a ++ "," ++ show b ++ "," ++ show c)
        . solve
        $ content

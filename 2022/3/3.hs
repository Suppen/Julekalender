import System.IO (readFile)
import Data.List (sort, permutations, null)

type Gift = (Int, Int, Int)

parseList :: FilePath -> IO [Gift]
parseList filename =
    return
    . map (\l -> read ("(" ++ l ++ ")"))
    . tail
    . lines
    =<< readFile filename

rollWidth :: Int
rollWidth = 110

calculateCut (w, h, l) = do
    [a, b, c] <- permutations [w, h, l]

    let bb1 = (a*2 + b*2, a + c)
        bb2 = (b*2 + c*2, a + b)
        bbs = filter (\(w, h) -> w <= rollWidth || h <= rollWidth)
              $ [bb1, bb2]

    map (\(w, h) -> if w > rollWidth || h > rollWidth
                       then max w h
                       else min w h) bbs

main =
    print
    . sum
    . map (minimum . calculateCut)
    =<< parseList "pakker.csv"
    -- $ [(30, 30, 20), (30, 30, 30), (25, 30, 20)]

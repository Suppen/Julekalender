import qualified Math.Combinatorics.Multiset as M

data Operation = ADD | SUB | CAT deriving (Eq, Ord, Show)

list :: [Int]
list = [1,2,3,4,5,6,7,8,7,6,5,4,3,2,1]

target :: Int
target = 42

-- Generate lists with all possible combinations of ADD, SUB and CAT with length of (length list)-1
allOps :: [[Operation]]
allOps = concat . map (M.permutations . M.fromList) $ baseOps total 0 0
    where total = (length list) - 1
          baseOps a s c
              | c == total = l : []
              | a == 0     = l : baseOps (s-1) 0 (c+1)
              | otherwise  = l : baseOps (a-1) (s+1) c
              where l = replicate a ADD ++ replicate s SUB ++ replicate c CAT

candidates :: [[(Operation, Int)]]
candidates = map (\ops -> zip (ADD : ops) list) allOps

calculate :: [(Operation, Int)] -> Int
calculate = foldr doMath 0 . resolveCats
    where resolveCats (x:[])                 = x:[]
          resolveCats ((opX, x):(CAT, y):ys) = resolveCats ((opX, x*10+y) : ys)
          resolveCats (x:y:ys)               = x : resolveCats (y:ys)
          doMath (ADD, n) m = m+n
          doMath (SUB, n) m = m-n

main = putStrLn
    . show
    . length
    . filter (== target)
    . map calculate
    $ candidates

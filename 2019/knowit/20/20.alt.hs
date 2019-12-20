import Data.List (findIndices)
import Data.Maybe (isJust, fromJust)

data Direction = CW | CCW deriving (Show, Eq)
type Workload = (Int, Int, Int, Int, Int)
type State = (Int, Int, Direction, Workload, [Int])

primes :: [Int]
primes = 2 : 3 : 5 : primes'
    where isPrime (p:ps) n = p*p > n || n `rem` p /= 0 && isPrime ps n
          primes' = 7 : filter (isPrime primes') (scanl (+) 11 $ cycle [2,4,2,4,6,2,6,4])

work :: Workload -> Int -> Workload
work (a, b, c, d, e) 1 = (a+1, b, c, d, e)
work (a, b, c, d, e) 2 = (a, b+1, c, d, e)
work (a, b, c, d, e) 3 = (a, b, c+1, d, e)
work (a, b, c, d, e) 4 = (a, b, c, d+1, e)
work (a, b, c, d, e) 5 = (a, b, c, d, e+1)

getWork :: Workload -> Int -> Int
getWork (a, _, _, _, _) 1 = a
getWork (_, b, _, _, _) 2 = b
getWork (_, _, c, _, _) 3 = c
getWork (_, _, _, d, _) 4 = d
getWork (_, _, _, _, e) 5 = e

mostWork :: Workload -> [Int]
mostWork (a, b, c, d, e) =
    let l   = [a, b, c, d, e]
        max = maximum l
        is  = findIndices (==max) l
    in  map (+1) is

leastWork :: Workload -> [Int]
leastWork (a, b, c, d, e) =
    let l   = [a, b, c, d, e]
        min = minimum l
        is  = findIndices (==min) l
    in  map (+1) is

neighbourElf :: Direction -> Int -> Int
neighbourElf CW 5 = 1
neighbourElf CCW 1 = 5
neighbourElf CW n = n+1
neighbourElf CCW n = n-1

rule1 :: State -> Maybe State
rule1 (nextStep, elfNo, direction, workload, (p:ps)) =
    if   nextStep == p && ((==1) . length $ nextElf)
    then Just (nextStep, head nextElf, direction, workload, ps)
    else Nothing
    where nextElf = leastWork workload

rule2 :: State -> Maybe State
rule2 (nextStep, elfNo, direction, workload, ps)
    | nextStep `mod` 28 == 0 = Just (nextStep, nextElf, otherDirection, workload, ps)
    | otherwise              = Nothing
    where otherDirection = if direction == CW then CCW else CW
          nextElf        = neighbourElf otherDirection elfNo

rule3 :: State -> Maybe State
rule3 (nextStep, elfNo, direction, workload, ps) =
    if   even nextStep && ((==1) . length $ mw) && head mw == neighbour
    then Just (nextStep, nextElf, direction, workload, ps)
    else Nothing
    where mw        = mostWork workload
          neighbour = neighbourElf direction elfNo
          nextElf   = neighbourElf direction neighbour

rule4 :: State -> Maybe State
rule4 (nextStep, _, direction, workload, ps)
    | nextStep `mod` 7 == 0 = Just (nextStep, 5, direction, workload, ps)
    | otherwise             = Nothing

rule5 :: State -> Maybe State
rule5 (nextStep, elfNo, direction, workload, ps) =
    Just (nextStep, neighbourElf direction elfNo, direction, workload, ps)

step :: State -> State
step (currentStep, elfNo, direction, workload, ps) =
    let newWorkload = work workload elfNo
        nextStep = currentStep+1
        ps' = dropWhile (<nextStep) ps
    in  fromJust
            . head
            . filter isJust
            $ [rule1, rule2, rule3, rule4, rule5] <*> pure (nextStep, elfNo, direction, newWorkload, ps')

main =
      (\(currentStep, elfNo, direction, workload, (p:_)) -> do
        print (currentStep, elfNo, direction, workload, p)
        print ((getWork workload . head . mostWork $ workload) - (getWork workload . head . leastWork $ workload)))
        . head
        . drop 1000740
        . iterate step
        $ (1, 1, CW, (0, 0, 0, 0, 0), primes)

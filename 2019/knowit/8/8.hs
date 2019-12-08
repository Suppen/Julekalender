import System.IO (readFile)
import Data.List.Split (splitOn)
import qualified Data.Map.Strict as M
import Data.Maybe (fromJust)

type Operation = String
type Wheel = [Operation]
type Prize = Int
type State = ([Wheel], Prize)

-- Applies a function to a value if a predicate function on the same value returns true
when :: (a -> Bool) -> (a -> a) -> a -> a
when cond onTrue val = if cond val then onTrue val else val

-- Rotates a wheel one step
rotate :: Wheel -> Wheel
rotate wheel = tail wheel ++ [head wheel] 

-- Rotates a specific wheel in a wheel list one step
rotateSpecific :: Int -> [Wheel] -> [Wheel]
rotateSpecific n wheels = zipWith (\f wheels -> f wheels) (replicate n id ++ [rotate] ++ repeat id) wheels

-- Operations which apply to the prize
prizeOps :: [(Operation, State -> State)]
prizeOps = map (fmap (\f -> \(wheels, prize) -> (wheels, f prize))) [
        ("PLUSS4",         (+4)),
        ("PLUSS101",       (+101)),
        ("MINUS9",         subtract 9),
        ("MINUS1",         subtract 1),
        ("REVERSERSIFFER", (\n -> (* sign n) . read . reverse . show . abs $ n)),
        ("OPP7",           (\n -> head . filter ((==7) . (`rem` 10)) . scanl (+) n . repeat $ 1)),
        ("GANGEMSD",       (\n -> n * msd n)),
        ("DELEMSD",        (\n -> n `div` msd n)),
        ("PLUSS1TILPAR",   updateDigits (when even ((`mod` 10) . (+1)))),
        ("TREKK1FRAODDE",  updateDigits (when odd (subtract 1)))
    ]
        where toDigits         = map read . map (:[]) . show . abs
              fromDigits       = read . concat . map show
              updateDigits f n = (* sign n) . fromDigits . map f . toDigits $ n
              msd              = head . toDigits
              sign n           = abs n `div` n

-- Operations which apply to the wheels
wheelOps :: [(Operation, State -> State)]
wheelOps = map (fmap (\f -> \(wheels, prize) -> (f wheels, prize))) [
        ("ROTERPAR",  zipWith exe (cycle [rotate, id])),
        ("ROTERODDE", zipWith exe (cycle [id, rotate])),
        ("ROTERALLE", map rotate)
    ]
        where exe f wheel = f wheel

-- Map of all possible operations (except STOPP)
operations :: M.Map String (State -> State)
operations = M.fromList (prizeOps ++ wheelOps)

-- Plays a full game on the machine
play :: State -> Prize
play (wheels, prize)
    | opName == "STOPP" = prize
    | otherwise         = play . op $ (rotateSpecific opWheel wheels, prize)
    where opWheel = (abs prize) `mod` 10
          opName  = head $ (wheels !! opWheel)
          op      = fromJust . M.lookup opName $ operations

-- Gets the set of wheels from file
getWheels :: String -> IO [Wheel]
getWheels fileName =
    return
        . map (splitOn ", " . drop 8)
        . lines 
        =<< readFile fileName

main = do
    wheels <- getWheels "input.txt"
    print
        . zip [0..]
        . map play
        . zip (repeat wheels)
        $ [0..10]

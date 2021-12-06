import System.IO (readFile)
import Data.Bifunctor (bimap)
import Data.List (find)
import Data.Maybe (fromMaybe)
import qualified Data.Set as S

type Start = Int
type Length = Int
type X = Int
type Y = Int
type Package = (Start, Length)
type Cell = (X, Y)
type DetPackage = S.Set Cell
type Stack = S.Set Cell

stackWidth :: Int
stackWidth = 20

stackHeight :: Stack -> Int
stackHeight = maximum . S.map snd

initialStack :: Stack
initialStack = S.fromList . map (\x -> (x,(-1))) $ [0..stackWidth-1]

parsePackages :: String -> [Package]
parsePackages =
    -- Read them as numbers
    map (bimap read read)
    -- The comma is part of the second value. Remove it
    . map (fmap tail)
    -- Split at comma
    . map (break (== ','))
    -- Split into lines
    . lines

-- A list of cells a package will occupy at a given height
packageCells :: Package -> Int -> DetPackage
packageCells (start, length) y = S.fromList $ zip [start..start + length - 1] (repeat y)

-- Find the height (Y coordinate) a package will land on on a stack
landingHeight :: Stack -> Package -> Int
landingHeight stack package =
    -- Default to 0. Should never happen
    fromMaybe 0
    -- Take its Y value plus one
    . fmap ((+1) . snd)
    -- Find a cell the package will land on
    . find (`S.member` stack)
    -- Make a list of all cells the package could occupy when falling
    . concat
    . map (S.toList . packageCells package)
    -- Create a list of numbers from the top to the bottom
    . (\h -> [h, h-1 .. 0])
    -- Find out how tall the stack is
    $ stackHeight stack

-- Adds cells to a stack
addToStack :: DetPackage -> Stack -> Stack
--addToStack cells stack = foldr S.insert stack cells
addToStack cells stack = S.union cells . S.filter ((`S.notMember` xs) . fst) $ stack
    where xs = S.map fst cells

-- A set of the cells directly under a package
supportingCells :: DetPackage -> Stack -> S.Set Cell
supportingCells package stack =
    -- The intersection between the lowered package and the stack is the filled cells directly under the package
    S.intersection stack
    -- Get the cells directly under the package as a set
    $ S.map (fmap (subtract 1)) package

isSupported :: DetPackage -> Stack -> Bool
isSupported package stack = hasSupport firstHalf && hasSupport lastHalf
    where halfLen = fromIntegral (length package) / 2
          xs = S.map fst package
          supportingXs = S.map fst $ supportingCells package stack
          firstHalf = S.take (ceiling halfLen) xs
          lastHalf = S.drop (floor halfLen) xs
          hasSupport = not . S.null . S.intersection supportingXs

solve :: Package -> (Int, Stack) -> (Int, Stack)
solve package (count, stack) =
    (\p ->
        -- Check if it stays
        if   isSupported p stack
        -- If so, add it to the stack
        then (count, addToStack p stack)
        -- Otherwise count it as fallen off
        else (count + 1, stack)
    )
    -- Get the package's cells at that height
    . packageCells package
    -- Figure out where on the stack the package will land
    $ landingHeight stack package

main =
    print
    . fst
    . foldl (flip solve) (0, initialStack)
    . parsePackages
    =<< readFile "pakker.txt"

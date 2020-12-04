import System.IO (readFile)
import Data.List (break)

type Milk = Int
type Flour = Int
type Eggs = Int
type Sugar = Int

parseIngredient :: String -> (String, Int, String)
parseIngredient xs = let (ing, rest1)    = break (== ':') xs
                         (amount, rest2) = break (== ',') (tail rest1)
                         rest            = if rest2 == "" then "" else tail rest2
                     in  (ing, read amount, rest)

parseIngredients :: String -> [(String, Int)]
parseIngredients [] = []
parseIngredients xs = let (ing, amount, rest) = parseIngredient xs
                      in  (ing, amount) : parseIngredients rest

accumulate :: (String, Int) -> (Milk, Flour, Eggs, Sugar) -> (Milk, Flour, Eggs, Sugar)
accumulate ("melk", amount) (milk, flour, eggs, sugar)   = (milk + amount, flour, eggs, sugar)
accumulate ("mel", amount) (milk, flour, eggs, sugar)    = (milk, flour + amount, eggs, sugar)
accumulate ("egg", amount) (milk, flour, eggs, sugar)    = (milk, flour, eggs + amount, sugar)
accumulate ("sukker", amount) (milk, flour, eggs, sugar) = (milk, flour, eggs, sugar + amount)

calculateCakes :: (Milk, Flour, Eggs, Sugar) -> Int
calculateCakes (milk, flour, eggs, sugar) = minimum [milk `div` 3, flour `div` 3, eggs, sugar `div` 2]

main = print
    . calculateCakes
    . foldr accumulate (0,0,0,0)
    . parseIngredients
    . filter (/= ' ')
    . map (\c -> if c == '\n' then ',' else c)
    =<< readFile("leveringsliste.txt")

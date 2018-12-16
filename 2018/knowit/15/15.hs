import System.IO (readFile)
import Data.List.Split (splitOn)

type Year = Int
type Age = Int

squares :: [Int]
squares = map (^2) [1..]

willHaveGoldBirthday :: Year -> Bool
willHaveGoldBirthday year = whgb year 1
    where whgb :: Year -> Age -> Bool
          whgb birthYear age
              | age2 > currentYear  = False
              | age2 == currentYear = True
              | otherwise           = whgb birthYear (age+1)
              where currentYear = birthYear + age
                    age2 = age^2

main = do
    content <- readFile "input.txt"
    print
        . length
        . filter willHaveGoldBirthday
        . map (\[_, year] -> read year :: Int)
        . map (splitOn " - f.")
        . lines
        $ content

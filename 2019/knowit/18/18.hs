import System.IO (readFile, writeFile)
import Data.List.Split (splitOn)
import Data.List (sort)
import Data.Char (ord, toLower)

data Gender = Male | Female deriving (Read, Show, Eq)
data Employee = Employee { getFirstname :: String, getLastname :: String, getGender :: Gender } deriving (Show, Read)

employee :: [String] -> Employee
employee ([firstname, lastname, g]) = Employee firstname lastname (if g == "F" then Female else Male)

hashEmployee :: Employee -> (Int, Int, Int)
hashEmployee e = let (h1, h2) = hashLastname (getFirstname e) (getLastname e) (getGender e)
                 in  (hashFirstname (getFirstname e), h1, h2)

hashFirstname :: String -> Int
hashFirstname = sum . map ord

hashLastname :: String -> String -> Gender -> (Int, Int)
hashLastname firstname lastname gender = 
    let (p1, p2) = splitAt (ceiling $ (fromIntegral (length lastname) / 2))
                       . map toLower
                       $ lastname
    in  (hashP1 p1, hashP2 p2)
    where hashP1 = sum
                       . map (+1)
                       . map (subtract (ord 'a'))
                       . map ord
          hashP2 = read
                       . reverse
                       . sort
                       . show
                       . (\n -> if   gender == Female
                                then n * (length (firstname ++ lastname))
                                else n * (length firstname))
                       . product
                       . map ord

getStarWarsName :: ([String], [String], [String], [String]) -> Employee -> String
getStarWarsName (m, f, l1, l2) employee =
    let (h1, h2, h3) = hashEmployee employee
        swFirstname  = if   getGender employee == Female
                       then f !! (h1 `mod` length f)
                       else m !! (h1 `mod` length m)
        swLastnameP1 = l1 !! (h2 `mod` length l1)
        swLastnameP2 = l2 !! (h3 `mod` length l2)
    in  swFirstname ++ " " ++ swLastnameP1 ++ swLastnameP2

main = do
    swNameParts <- return
                       . (\[m, f, l1, l2] -> (m, f, l1, l2))
                       . map lines
                       . splitOn "---\n"
                       =<< readFile "names.txt"
    employees <- return
                     . map employee
                     . map (splitOn ",")
                     . lines
                     . tail
                     =<< readFile "employees.csv"

    writeFile "output.txt"
        . unlines
        . sort
        . map (getStarWarsName swNameParts)
        $ employees

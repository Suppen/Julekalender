import System.IO (readFile)
import Data.Time.Calendar (fromGregorianValid)
import Data.Maybe (isJust)
import Data.List.Split (chunksOf)

type Pid = String

readChar :: Char -> Int
readChar = read . (:[])

isValid :: Pid -> Bool
isValid pid =
    correctLength pid
    && isValidBirthdate pid
    && controlDigitsOk pid

correctLength :: Pid -> Bool
correctLength = (==11) . length

isValidBirthdate :: Pid -> Bool
isValidBirthdate pid =
    isJust
        . (\(d,m,y) -> fromGregorianValid y m d)
        . (\(d,m,y) -> (d, m, fromIntegral y))
        . (\(d:m:y:_) -> if   y < 19
                          then (d,m,y+2000)
                          else (d,m,y+1900))
        . map read
        . chunksOf 2
        $ pid

controlDigitsOk :: Pid -> Bool
controlDigitsOk pid =
    firstControlDigitOk pid
    && secondControlDigitOk pid

firstControlDigitOk :: Pid -> Bool
firstControlDigitOk pid =
    let digit = readChar $ pid !! 9
        checksum = (`mod` 11)
                       . sum
                       . zipWith (*) [3,7,6,1,8,9,4,5,2]
                       . map readChar
                       $ pid
    in  checkControlDigit checksum digit

secondControlDigitOk :: Pid -> Bool
secondControlDigitOk pid =
    let digit = readChar $ pid !! 10
        checksum = (`mod` 11)
                       . sum
                       . zipWith (*) [5,4,3,2,7,6,5,4,3,2]
                       . map readChar
                       $ pid
    in  checkControlDigit checksum digit

checkControlDigit :: Int -> Int -> Bool
checkControlDigit checksum digit =
    if   checksum == 0
    then digit == 0
    else digit == 11 - checksum

isFemale :: Pid -> Bool
isFemale = even . readChar . (!!8)

isBornInAugust :: Pid -> Bool
isBornInAugust =
    (==) "08"
    . take 2
    . drop 2

main = do
    content <- readFile "input.txt"
    print
        . length
        . filter isValid
        . filter isFemale
        . filter isBornInAugust
        . lines
        $ content

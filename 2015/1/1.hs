import System.IO
import Text.Regex.Posix

main = do
    contents <- readFile "1.txt"
    let ids = lines contents
        validIds = filter isValid ids
        validNum = length validIds
    putStrLn (show validNum)

isValid :: String -> Bool
isValid id = id =~ "^[a-z]{0,3}[0-9]{2,8}[A-Z]{3,}"

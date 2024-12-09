parseNumbers :: String -> [Int]
parseNumbers [] = []
parseNumbers ('t' : 'o' : 'l' : 'v' : rest) = 12 : parseNumbers rest
parseNumbers ('a' : 't' : 't' : 'e' : 'n' : rest) = 18 : parseNumbers rest
parseNumbers ('t' : 'j' : 'u' : 'e' : 'f' : 'i' : 'r' : 'e' : rest) = 24 : parseNumbers rest
parseNumbers ('t' : 'r' : 'e' : 't' : 't' : 'i' : 's' : 'e' : 'k' : 's' : rest) = 36 : parseNumbers rest
parseNumbers ('t' : 'r' : 'e' : 't' : 't' : 'i' : rest) = 30 : parseNumbers rest
parseNumbers ('f' : 'ø' : 'r' : 't' : 'i' : 't' : 'o' : rest) = 42 : parseNumbers rest
parseNumbers ('f' : 'ø' : 'r' : 't' : 'i' : 'å' : 't' : 't' : 'e' : rest) = 48 : parseNumbers rest
parseNumbers ('f' : 'e' : 'm' : 't' : 'i' : 'f' : 'i' : 'r' : 'e' : rest) = 54 : parseNumbers rest
parseNumbers ('s' : 'e' : 'k' : 's' : 'i' : 's' : 'e' : 'k' : 's' : rest) = 66 : parseNumbers rest
parseNumbers ('s' : 'e' : 'k' : 's' : 't' : 'i' : rest) = 60 : parseNumbers rest
parseNumbers ('s' : 'e' : 'k' : 's' : rest) = 6 : parseNumbers rest
parseNumbers ('s' : 'y' : 't' : 't' : 'i' : 't' : 'o' : rest) = 72 : parseNumbers rest
parseNumbers ('s' : 'y' : 't' : 't' : 'i' : 'å' : 't' : 't' : 'e' : rest) = 78 : parseNumbers rest
parseNumbers ('å' : 't' : 't' : 'i' : 'f' : 'i' : 'r' : 'e' : rest) = 84 : parseNumbers rest
parseNumbers ('n' : 'i' : 't' : 't' : 'i' : rest) = 90 : parseNumbers rest
parseNumbers ('n' : 'i' : 't' : 't' : 'i' : 's' : 'e' : 'k' : 's' : rest) = 96 : parseNumbers rest
parseNumbers _ = error "Invalid input"

main = print . (`div` 6) . sum . parseNumbers =<< readFile "tall.txt"

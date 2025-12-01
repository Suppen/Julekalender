data Command = Add String | Count | Process deriving (Show, Eq)

processInput :: String -> [Command]
processInput = map processLine . lines
  where
    processLine ('A' : 'D' : 'D' : ' ' : x) = Add x
    processLine ('C' : 'O' : 'U' : 'N' : 'T' : _) = Count
    processLine ('P' : 'R' : 'O' : 'C' : 'E' : 'S' : 'S' : _) = Process

solve :: [Command] -> [String] -> String -> String
solve [] _ acc = reverse acc
solve (Add x : cs) queue acc = solve cs (x : queue) acc
solve (Count : cs) queue acc = solve cs queue ((last . show $ (length queue)) : acc)
solve (Process : cs) [] acc = solve cs [] ('X' : acc)
solve (Process : cs) queue acc = solve cs (init queue) ((head . last $ queue) : acc)

main = do
  input <- processInput <$> readFile "input.txt"

  print $ solve input [] []

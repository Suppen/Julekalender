import System.IO (readFile)

data Hood = Hood { getIndex :: Int, getLength :: Int } deriving Show

findLongestNeutralHood :: String -> Int
findLongestNeutralHood houses = something houses 0 0 0
    where something [] _ _ longestLength = longestLength
          something (x:xs) len balance longestLength = something xs len' balance' longestLength'
              where balance' = if x == 'J' then balance + 1 else balance - 1
                    len' = len + 1
                    longestLength' = if balance' == 0 then len' else longestLength

something :: String -> Hood
something =
    foldl1 (\longest current -> if getLength current > getLength longest then current else longest)
    . map (\(i, houses) -> Hood i (findLongestNeutralHood houses))
    . zip [0..]
    . takeWhile (/= [])
    . iterate tail

main = do
    houses <- readFile "input.txt"
    let longestNeutralHood = something houses

    print (show (getLength longestNeutralHood) ++ ", " ++ show (getIndex longestNeutralHood))

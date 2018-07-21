import Data.Char (ord)

reduceToPalindrome :: String -> Int
reduceToPalindrome str = sum $ zipWith (\c1 c2 -> abs((ord c1) - (ord c2))) s r
    where halfLength = (length str) `div` 2
          s = take halfLength str
          r = take halfLength (reverse str)

main = putStrLn $ show $ reduceToPalindrome "evdhtiqgfyvcytohqppcmdbultbnzevdbakvkcdpbatbtjlmzaolfqfqjifkoanqcznmbqbeswglgrzfroswgxoritbw"

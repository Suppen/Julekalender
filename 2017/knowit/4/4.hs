import System.IO (readFile)
import qualified Data.Map.Strict as M

-- | Checks if a list is a palindrome
isPalindrome :: Eq a =>
                [a] ->  -- ^ The list to check
                Bool    -- ^ Whether or not the list is a palindrome
isPalindrome list = list == reverse list

-- | Checks if there exists at least one permutation of the list which would be a palindrome
hasPalindromeAnagram :: Ord a =>
                        [a] ->   -- ^ The list to check
                        Bool     -- ^ The result
hasPalindromeAnagram =
    (<2)
    . M.foldr (\n acc -> if even n then acc else acc+1) 0
    . M.fromListWith (+)
    . (flip zip) (repeat 1)

main = do
    content <- readFile "wordlist.txt"
    let result = length
                 . filter (==True)
                 . map hasPalindromeAnagram
                 . filter (not . isPalindrome)
                 . words
                 $ content
    putStrLn $ show result

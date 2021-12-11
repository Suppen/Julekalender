import System.IO (readFile)
import qualified Data.Map.Strict as M
import Data.List (find, findIndices)
import Data.Maybe (catMaybes, isJust)
import Control.Monad (join)

type Name = String
type Encrypted = String

swappedVersions :: Name -> [Name]
swappedVersions name = name : swappedVersions' name ""
    where swappedVersions' (_:[]) _ = []
          swappedVersions' (n1:n2:ns) prefix  = (prefix ++ (n2:n1:ns)) : swappedVersions' (n2:ns) (prefix ++ [n1])

decrypt :: Name -> Encrypted -> Maybe Name
decrypt name encrypted =
    -- Flatten the monad
    join
    -- Find the first (should be one or none) non-empty result
    . find isJust
    -- Call the actual decrypt function with all variants of the name
    $ decrypt' <$> map (\n -> (n,n)) (swappedVersions name) <*> pure encrypted
    where decrypt' :: (Name, Name) -> Encrypted -> Maybe Name
          -- The whole name has been consumed. This is a match
          decrypt' (name, []) _ = Just name
          -- The whole line has been consumed. This is not a match
          decrypt' _ [] = Nothing
          decrypt' (name, n:ns) (e:es)
              -- The first characters of the name and the line matches. Consume them
              | n == e    = decrypt' (name, ns) es
              -- Consume the first character of the line
              | otherwise = decrypt' (name, n:ns) es

matchLength :: Name -> Encrypted -> Int
matchLength altName encrypted =
    let firstLetterIndex = head (findIndices (== head altName) encrypted)
        lastLetterIndex  = last (findIndices (== last altName) encrypted)
    in  lastLetterIndex - firstLetterIndex + 1

main = do
    names <- lines <$> readFile "names.txt"
    encrypted <- lines <$> readFile "locked.txt"

    print
        . foldr (\new@(_, count) old@(_, highestCount) -> if count > highestCount then new else old) ("kake", 0)
        . M.toList
        -- Count them
        . foldr (\name m -> M.insertWith (+) name 1 m) M.empty
        -- Get only the child names
        . map snd
        . M.toList
        -- Drop the count of excess characters
        . M.map (fst . head)
        -- Take only the lines with only one match
        . M.filter ((== 1) . length)
        -- Find the names with fewest excess characters for each line
        . M.map (\names -> let fewest = minimum . map snd $ names
                           in  filter ((== fewest) . snd) names
          )
        -- Make a map from encrypted lines to tuples of names matching it and number of excess characters
        . foldr (\(name, encrypted, excess) m ->
              M.insertWith (\(new:_) old -> new:old) encrypted [(name, excess)] m
            )
            M.empty
        . map (\(name, encrypted, altName) -> (name, encrypted, matchLength altName encrypted - length name))
        -- Take only those in which the line is an encrypted form of the name
        . catMaybes
        . map (\(n, e) -> fmap (\altName -> (n, e, altName)) (decrypt n e))
        -- Make a list of all possible pairs of names and encrypted lines
        $ [(n, e) | n <- names, e <- encrypted]

testLine :: Encrypted
testLine = "xuabcfglxvuabcflxz"

testName :: Name
testName = "alvulf"

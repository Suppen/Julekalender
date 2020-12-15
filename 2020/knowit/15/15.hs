import System.IO (readFile)
import Data.List (stripPrefix, transpose)
import Data.List.Split (splitOn)
import qualified Data.Set as S
import Data.Maybe (catMaybes)

findGlue :: [String] -> (String, String) -> S.Set String
findGlue words (pre, suf) =
    -- The intersection of these sets is the result
    foldr1 S.intersection
    -- Make sets from them
    . map S.fromList
    -- Ignore the empty matches
    . map (filter (/= ""))
    -- Ignore the Nothings
    . map catMaybes
    -- Transpose them into two lists: one with the left matches, one with the right
    . transpose
    -- Take those which had exactly one result
    . filter hasOneJust
    -- Make tuples (lists, actually) of the word minus the prefix and suffix
    . map (\word -> [
        -- Remove the prefix from the word
        stripPrefix pre word,
        -- Remove the suffix from the word
        fmap reverse . stripPrefix (reverse suf) $ reverse word
    ])
    $ words
    where hasOneJust [(Just _), Nothing] = True
          hasOneJust [Nothing, (Just _)] = True
          hasOneJust _                   = False

main = do
    words <- lines <$> readFile "wordlist.txt"
    riddles' <- lines <$> readFile "riddles.txt"

    let riddles = map (\[pre, suf] -> (pre, suf))
                  . map (splitOn ", ")
                  $ riddles'
    --let riddles = [("innovasjons", "løsheta"), ("spektral", "sikringens"), ("verdens", "spillet")]

    print . length . concat . filter (\word -> elem word words) . S.toList . foldr1 S.union . map (findGlue words) $ riddles
    return ()

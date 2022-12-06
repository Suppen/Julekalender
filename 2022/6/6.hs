import qualified Data.Map.Strict as M
import Data.Maybe (fromMaybe)
import Data.List (sort)

type Action = String
type BadActions = M.Map Action Float
type Candidate = String
data Vote = Vote [Action] Candidate deriving (Show)
type Result = M.Map Candidate Float

parseBadActions :: FilePath -> IO BadActions
parseBadActions fileName =
    return
    . M.fromList
    . map (fmap (read . tail))
    . map (break (== ':'))
    . lines
    =<< readFile fileName

parseVotes :: FilePath -> IO [Vote]
parseVotes fileName =
    return
    . map parseVote
    . lines
    =<< readFile fileName
        where parseVote :: String -> Vote
              parseVote line = let (actions, candidate) = fmap tail . break (== ':') $ line
                                in Vote (parseActions actions) candidate
              parseActions :: String -> [String]
              parseActions str = parseActions' str []
              parseActions' :: String -> [String] -> [String]
              parseActions' [] acc        = acc
              parseActions' (',':str) acc = parseActions' str acc
              parseActions' str acc       = let (action, str') = break (== ',') str
                                             in parseActions' (str') (action : acc)

election :: BadActions -> [Vote] -> Result
election badActions votes = foldr countFn M.empty votes
    where countFn :: Vote -> Result -> Result
          countFn (Vote actions candidate) res =
              let weight = minimum $ scanr weightFn 1.0 actions
                  alterFn :: Maybe Float -> Maybe Float
                  alterFn (Just count) = Just (count + weight)
                  alterFn Nothing      = Just weight
               in M.alter alterFn candidate res
          weightFn :: Action -> Float -> Float
          weightFn action w = fromMaybe 1.0 $ M.lookup action badActions

main =
    print
    . round
    . (\(a:b:_) -> a - b)
    . reverse
    . sort
    . M.elems
    =<< election <$> parseBadActions "slemmehandlinger.txt" <*> parseVotes "stemmer.txt"

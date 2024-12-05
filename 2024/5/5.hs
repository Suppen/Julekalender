import Data.Bifunctor (second)
import Data.List (isPrefixOf, sortOn)
import Data.Map.Strict qualified as M

type Candidate = (Int, String, String)

type CandidateVotes = (Candidate, Int)

type State = (Int, String, Int, [CandidateVotes])

splitOn :: String -> String -> [String]
splitOn delim = go
  where
    go "" = [""]
    go s
      | delim `isPrefixOf` s = "" : go (drop (length delim) s)
      | otherwise =
          let (x : xs) = go (tail s)
           in (head s : x) : xs

parseCandidate :: String -> Candidate
parseCandidate str =
  let parts = splitOn " - " str
   in case parts of
        [id, name, party] -> (read $ tail id, name, party)
        _ -> error $ "Invalid candidate format: " ++ str

makeCandidateMap :: [Candidate] -> M.Map Int Candidate
makeCandidateMap = M.fromList . map (\c@(id, _, _) -> (id, c))

parseVotes :: M.Map Int Candidate -> String -> CandidateVotes
parseVotes candidates str =
  let [candidateId, votes] = splitOn ":" str
      candidate = candidates M.! read (tail candidateId)
   in (candidate, read votes)

parseState :: M.Map Int Candidate -> String -> State
parseState candidateMap str =
  let parts = splitOn " - " str
   in case parts of
        [id, name, electorsStr, votesStr] ->
          ( read $ tail id,
            name,
            read electorsStr,
            map (parseVotes candidateMap) (splitOn ", " votesStr)
          )
        _ -> error $ "Invalid state format: " ++ str

processState :: State -> M.Map Candidate Int
processState (_, _, electors, cvs) =
  let totalVotes = sum $ map snd cvs
      fracPerCandidate = map (\(c, v) -> (c, fromIntegral v / fromIntegral totalVotes * fromIntegral electors)) cvs
      wholePerCandidate = map (second floor) fracPerCandidate
      restPerCandidate = zipWith (\(c, fracE) (_, wholeE) -> (c, fracE - fromIntegral wholeE)) fracPerCandidate wholePerCandidate
      remainingElectors = electors - sum (map snd wholePerCandidate)
      levellingSeats = map fst . take remainingElectors . reverse $ sortOn snd restPerCandidate
      electorsPerCandidate = [(c, e + if c `elem` levellingSeats then 1 else 0) | (c, e) <- wholePerCandidate]
   in M.fromList electorsPerCandidate

main = do
  candidates <- map parseCandidate . lines <$> readFile "kandidater.txt"
  let candidateMap = makeCandidateMap candidates
  states <- map (parseState candidateMap) . lines <$> readFile "stater.txt"
  let processedStates = map processState states

  let result = foldr (M.unionWith (+)) M.empty processedStates

  print result

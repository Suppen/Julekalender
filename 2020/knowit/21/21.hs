import System.IO (readFile)
import Data.List.Split (splitOn)
import Data.Sequence as S (Seq, empty, null, Seq ((:|>), (:<|)))
import qualified Data.Map.Strict as M
import Data.List (scanl')

type Name = String
type Priority = Int
type Patient = (Name, Priority)
type TreatedPatients = Int
type Queue = Seq Name
type Queues = M.Map Priority Queue

parseLine :: String -> Maybe Patient
parseLine "---" = Nothing
parseLine s = let (name:priStr:[]) = splitOn "," s
              in  Just (name, read priStr)

takeNextPatient :: Queues -> (Name, Queues)
takeNextPatient queues =
    (\(pri, (name :<| queue)) -> (name, M.insert pri queue queues))
    . head
    . dropWhile (S.null . snd)
    . M.toAscList
    $ queues

processPatient :: Maybe Patient -> (Name, TreatedPatients, Queues) -> (Name, TreatedPatients, Queues)
processPatient Nothing (_, treatedPatients, queues)                      =
    let (lastPatient, queues') = takeNextPatient queues
    in (lastPatient, treatedPatients+1, queues')
processPatient (Just (name, pri)) (lastPatient, treatedPatients, queues) =
    (lastPatient, treatedPatients, M.adjust (:|> name) pri queues)

main =
    print
    . (\(_, treatedPatients, _) -> treatedPatients)
    . head
    -- Wait for Santa Claus to be treated
    . dropWhile (\(name, _, _) -> name /= "Claus")
    -- Process the waiting room
    . scanl' (flip processPatient) ("Bob", 0, (M.fromList $ zip [1..5] (repeat S.empty)))
    -- Parse the queue into a more usable format
    . map parseLine
    -- Add infinitely many free slots at the end of the list
    . (++ (repeat "---"))
    -- Read the file line by line
    . lines
    =<< readFile "input.txt"

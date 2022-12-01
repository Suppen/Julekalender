import System.IO (readFile)
import Data.List (isPrefixOf)

type Shona = String
type English = String
type Dict = [(Shona, English)]

parseDictionary :: FilePath -> IO Dict
parseDictionary filename =
    return
    . fmap (fmap tail)
    . fmap (break (== ','))
    . lines
    =<< readFile filename

candidates :: Dict -> String -> [(English, String)]
candidates dict str =
    fmap (\(s, eng) -> (eng, drop (length s) str))
    . filter (flip isPrefixOf str . fst)
    $ dict

translate :: Dict -> [String] -> String -> [String]
translate _ e [] = reverse e
translate dict e str = do
    cand <- candidates dict str

    let (eng, str') = cand

    translate dict (eng:e) str'


main = do
    dict <- parseDictionary "dictionary.txt"
    letter <- readFile "letter.txt"
    --let letter = "inichidomunhuimbwa"

    let ans = translate dict [] letter

    print . length . unwords $ ans

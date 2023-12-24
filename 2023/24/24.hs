import Data.Maybe (mapMaybe)
import qualified Data.Map as M
data Transaction = Transaction String Int Int deriving (Show)

charMap :: M.Map Char Int
charMap =
  M.union
    (M.fromList $ zip (['A'..'Z'] ++ "ÆØÅ") [1..])
    (M.fromList $ zip (['a'..'z'] ++ "æøå") [1..])

parseTransactions :: String -> [Transaction]
parseTransactions =
  map (
        (\[name, price, checksum] -> Transaction name (read price) (read checksum))
        . parts
  )
  . lines
  where parts :: String -> [String]
        parts [] = []
        parts s = let (x, s') = break (== ';') s
                  in  x : parts (drop 1 s')

transactionIsValid :: Transaction -> Bool
transactionIsValid (Transaction name price checksum) =
  let charSum = (`mod` 0xbeef) . (* price) . sum . mapMaybe (`M.lookup` charMap) $ name
  in  charSum == checksum

main = do
  transactions <- parseTransactions <$> readFile "transaksjoner.txt"

  print
    . map (\(Transaction name _ _) -> head name)
    . filter (not . transactionIsValid)
    $ transactions

import System.IO (readFile)
import qualified Data.Map.Strict as M

type Account = String
type Bank = M.Map Account Int

doTransaction :: Account -> Account -> Int -> Bank -> Bank
doTransaction from to amount = deposit to amount . withdraw from amount

withdraw :: Account -> Int -> Bank -> Bank
withdraw account amount = M.adjust (subtract amount) account

deposit :: Account -> Int -> Bank -> Bank
deposit account amount bank
    | M.member account bank = M.adjust ((+) amount) account bank
    | otherwise             = deposit account amount (M.insert account 0 bank)

main = do
    contents <- readFile "transaksjoner.txt"
    let transactions = map words
                       $ lines
                       $ map (\c -> if c == ',' then ' ' else c) contents
        foldFunc = (\bank [from, to, amount] -> doTransaction from to (read amount) bank)
        initialBank = M.singleton "None" 0
        bank = foldl foldFunc initialBank transactions
    putStrLn $ show $ length $ filter ((>10) . snd) $ M.toList bank

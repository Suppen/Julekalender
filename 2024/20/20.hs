import Data.Bifunctor (second)
import Data.List (maximumBy, splitAt)
import Data.Map.Strict qualified as M
import Data.Ord (comparing)

type Elf = (String, Int)

type PartyMap = M.Map Elf Int

parseElves :: String -> [Elf]
parseElves = map (second (read . tail) . break (== ' ')) . lines

partySortElves :: [Elf] -> (Elf, Int)
partySortElves (first : second : rest) = partySortElves' 0 M.empty [first] (second : rest)
  where
    partySortElves' _ partyMap _ [] = maximumBy (comparing snd) . M.toList $ partyMap
    partySortElves' swaps partyMap [] (f : fs) = partySortElves' swaps partyMap [f] fs
    partySortElves' swaps partyMap (b : bs) (f : fs)
      | snd f < snd b && swaps /= 6 = partySortElves' (swaps + 1) partyMap bs (f : b : fs)
      | snd f < snd b && swaps == 6 = partySortElves' 0 partyMap' bs fs'
      | otherwise = partySortElves' swaps partyMap (f : b : bs) fs
      where
        (partying, rest) = splitAt 5 (b : fs)
        partyMap' = foldr (\elf m -> M.insertWith (+) elf 1 m) partyMap partying
        fs' = [f] ++ reverse partying ++ rest

main = do
  elves <- parseElves <$> readFile "usorterte_alver.txt"
  let (bestPartyElf, parties) = partySortElves elves

  putStrLn $ fst bestPartyElf ++ "," ++ show parties

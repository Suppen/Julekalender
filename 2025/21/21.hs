import Data.List (findIndex)
import Data.Maybe (catMaybes)

alphabet :: String
alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ"

reindeer :: String
reindeer = "VÆFUPO"

color :: String
color = "VEFZ SP IUHRZ"

sleigh :: String
sleigh = "JUTGR PCUJWPGT XRN QRWYGT"

findPattern :: String -> String -> [Int]
findPattern cipher expected =
  map (`mod` (length alphabet))
  . catMaybes
  $ zipWith (\c e -> if c == ' ' then Nothing else (-) <$> findIndex (== c) alphabet <*> findIndex (== e) alphabet) cipher expected

applyPattern :: [Int] -> String -> Maybe String
applyPattern pattern cipher = applyPattern' (cycle pattern) cipher []
  where applyPattern' _ [] acc          = fmap reverse . sequence $ acc
        applyPattern' ps (' ':cs) acc   = applyPattern' ps cs (Just ' ' : acc)
        applyPattern' (p:ps) (c:cs) acc = let i' = (-) <$> findIndex (== c) alphabet <*> Just p
                                              i  = fmap (`mod` (length alphabet)) i'
                                              d  = fmap (alphabet !!) i
                                          in  applyPattern' ps cs (d : acc)

-- Pattern is found by trial and error in GHCI
main = mapM_ putStrLn $ applyPattern [4,6,2,6,4,9,2,3,9] sleigh

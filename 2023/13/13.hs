import qualified Data.Map.Strict as M
import qualified Data.Set as S

primes :: [Int]
primes = 2 : primes'
    where isPrime (p:ps) n = p*p > n || n `rem` p /= 0 && isPrime ps n
          primes' = 3 : filter (isPrime primes') [5, 7 ..]

makeElfLightMap :: Int -> Int -> M.Map Int (Int, Int)
makeElfLightMap windows highestNumberedElf =
  M.fromAscList
  $ zipWith (\elf prime -> (elf, ((elf * 2) `mod` windows, (elf + prime) `mod` windows))) [0..highestNumberedElf] primes

lightCandles :: S.Set Int -> M.Map Int (Int, Int) -> S.Set Int
lightCandles elvesAtWork elfLightMap =
  S.foldr (\elf lights -> let (a, b) = elfLightMap M.! elf
                          in  S.insert a . S.insert b $ lights) S.empty elvesAtWork

grinchCandles :: S.Set Int -> S.Set Int -> S.Set Int
grinchCandles = S.difference

appearsToBeAtWork :: Int -> S.Set Int -> M.Map Int (Int, Int) -> Bool
appearsToBeAtWork elf lights elfLightMap =
  let (a, b) = elfLightMap M.! elf
  in  S.member a lights && S.member b lights

main = do
    elvesAtWork <- S.fromList . map read . lines <$> readFile "alver_på_jobb.txt"
    elvesNotAtWork <- S.fromList . map read . lines <$> readFile "alver_ikke_på_jobb.txt"
    grinch <- S.fromList . map read . lines <$> readFile "grinchen.txt"

    let windows = 400009
        highestNumberedElf = max (maximum elvesAtWork) (maximum elvesNotAtWork)
        elfLightMap = makeElfLightMap windows highestNumberedElf
        preGrinchCandles = lightCandles elvesAtWork elfLightMap
        postGrinchCandles = grinchCandles preGrinchCandles grinch
        gettingAwayPreGrinch = S.filter (\e -> appearsToBeAtWork e preGrinchCandles elfLightMap) elvesNotAtWork
        gettingAwayPostGrinch = S.filter (\e -> appearsToBeAtWork e postGrinchCandles elfLightMap) elvesNotAtWork

    print $ S.size gettingAwayPreGrinch - S.size gettingAwayPostGrinch

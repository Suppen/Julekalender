import Data.Char (isLetter, toLower, ord)

cleartextMessage :: String
cleartextMessage = "Your message was received with gratitude! We do not know about you, but Christmas is definitely our favourite holiday. The tree, the lights, all the presents to unwrap. Could there be anything more magical than that?! We wish you a happy holiday and a happy new year!"

romans :: [String]
romans = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII"];

type Roman = String

getRoman :: Int -> String
getRoman = (!!) romans

encrypt :: String -> [Roman]
encrypt =
    (\romanified -> concat [map fst romanified, map snd $ reverse romanified])
    . map (\(a,b) -> (getRoman a, getRoman b))
    . map splitNumber
    . map ((+1) . subtract (ord 'a') . ord)
    . filter isLetter
    . map toLower
    where splitNumber n =
              let m = n `div` 2
              in  if even n
                  then (m,m)
                  else (m+1,m)
          
main = putStrLn $ show $ encrypt cleartextMessage

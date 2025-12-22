import Data.Char (ord)
import qualified Data.Set as S

magicChars :: S.Set Char
magicChars = S.fromList "Md+"

calculateChecksum :: String -> Int
calculateChecksum =
  sum
  . zipWith calculateLineScore [1..]
  . lines

calculateLineScore :: Int -> String -> Int
calculateLineScore lineNo line =
  let magicCharScore   = (* lineNo) . length . filter (`S.member` magicChars) $ line
      krampusCharScore = sum . map ord . filter (`S.notMember` magicChars) $ line
  in  magicCharScore - krampusCharScore

main = (print . calculateChecksum) =<< readFile "input.txt"

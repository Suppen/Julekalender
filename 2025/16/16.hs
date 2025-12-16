import qualified Data.Map as M
import Data.List (intercalate)
import Data.Char (digitToInt)

type Position = (Int, Int)
type Color = String
type PixelMap = M.Map Position Color

parsePixels :: String -> PixelMap
parsePixels = M.fromList . map parsePixel . words
  where parsePixel :: String -> ((Int, Int), String)
        parsePixel input = let (pos, color') = break (== ']') input
                               (x, (_:y)) = break (== ',') . drop 1 $ pos
                               color = take 6 . drop 2 $ color'
                           in  ((read x, read y), color)

draw :: Int -> Int -> PixelMap -> String
draw width height pixels = ""
  ++ "P3\n"
  ++ show width ++ " " ++ show height ++ "\n"
  ++ "255\n"
  ++ drawPixels
  where drawPixels =
          intercalate " "
          . map toIntStr
          . map (\pos -> maybe "FFFFFF" id (M.lookup pos pixels))
          $ [(y, x) | x <- [0..(width-1)], y <- [0..(height-1)]]
        toIntStr (r16:r1:g16:g1:b16:b1:[]) = intercalate " " . map show $ [
            (digitToInt r16) * 16 + (digitToInt r1),
            (digitToInt g16) * 16 + (digitToInt g1),
            (digitToInt b16) * 16 + (digitToInt b1)
          ]

main = do
  pixels <- parsePixels <$> readFile "input.txt"

  writeFile "output.ppm" $ draw 1024 1024 pixels

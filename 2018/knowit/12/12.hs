import System.IO (readFile)
import Data.Char (ord, chr)
import Data.Bits ((.&.))

main = do
    content <- readFile "input.txt"
    print
        . map (chr . (+) (ord ' '))
        . map (127 .&.)
        . map ord
        $ content

import System.IO (readFile)
import qualified Data.Text as T

main = do
    content <- readFile("input.txt")
    print
        . length
        . filter (== ' ')
        . T.unpack
        . T.concat
        . map T.strip
        . T.lines
        . T.pack
        $ content
{--
        $  "#    \n"
        ++ "#   #\n"
        ++ "## ##\n"
        ++ "#####\n"
--}

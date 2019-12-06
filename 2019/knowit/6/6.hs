import System.IO (readFile, writeFile)
import Data.List.Split (splitOn, chunksOf)
import Data.Bits (xor)

type Ppm = ((Int, Int), [Rgb])
type Rgb = (Int, Int, Int)

readPpm :: String -> IO Ppm
readPpm filename  =
    return
        . (\(_:dim:_:pxs) -> let ([x, y]) = splitOn " " dim
                                 rgbNums = map read pxs
                                 rgbs = map (\[r,g,b] -> (r, g, b)) (chunksOf 3 rgbNums)
                             in  ((read x, read y), rgbs))
        . lines
        =<< readFile filename

writePpm :: String -> Ppm -> IO ()
writePpm filename ((x, y), rgbs) =
    writeFile filename
        . unlines
        $ "P3" : concat [show x, " ", show y] : "255" : map show (concat $ map (\(r,g,b) -> [r, g, b]) rgbs)


solve :: Ppm -> Ppm
solve (dim, rgbs) = (dim, zipWith xor' rgbs ((0,0,0) : rgbs))
    where xor' (r1, g1, b1) (r2, g2, b2) = (xor r1 r2, xor g1 g2, xor b1 b2)

main =
    writePpm "solved.ppm"
        . solve
        =<< readPpm "input.ppm"

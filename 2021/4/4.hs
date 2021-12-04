import System.IO (writeFile)

northSteps :: [Integer]
northSteps = scanl (+) 3 $ cycle [3, 3, 3, 6]

eastSteps :: [Integer]
eastSteps = scanl (+) 5 $ cycle [5, 10]

turnCoords :: [(Integer, Integer)]
turnCoords = zip
    (0 : 0 : (eastSteps >>= replicate 2))
    (0 : (northSteps >>= replicate 2))

something n = (30 * n - 5, 15 * n + 3)

main =
    writeFile "points.dat"
        . (>>= (\(x, y) -> show x ++ " " ++ show y ++ "\n"))
        . take 50
        $ turnCoords

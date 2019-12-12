import System.IO (readFile)

reducer :: Char -> (Char, Int, Int) -> (Char, Int, Int)
reducer 'G' (_, _, speed)                  = ('G', 1, speed - 27)
reducer 'I' ('I', prevTerrainCount, speed) = ('I', prevTerrainCount+1, speed + (prevTerrainCount+1) * 12)
reducer 'I' (_, _, speed)                  = ('I', 1, speed + 12)
reducer 'A' (_, _, speed)                  = ('A', 1, speed - 59)
reducer 'S' (_, _, speed)                  = ('S', 1, speed - 212)
reducer 'F' ('F', 1, speed)                = ('F', 2, speed + 35)
reducer 'F' (_, _, speed)                  = ('F', 1, speed - 70)

main =
    print
        . length
        . takeWhile (> 0)
        . map (\(_, _, speed) -> speed)
        . scanl (flip reducer) ('X', 1, 10703437)
        =<< readFile "input.txt"
--        . scanl (flip reducer) ('X', 1, 300)
--        $ "IIGGFFAIISGIFFSGFAAASS"

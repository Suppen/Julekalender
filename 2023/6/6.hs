type Point = (Int, Int)

distanceBetween :: Point -> Point -> Float
distanceBetween (x1, y1) (x2, y2) = sqrt (fromIntegral (dx * dx + dy * dy))
  where
    dx = x1 - x2
    dy = y1 - y2

parsePath :: String -> [Point]
parsePath =
  map ((\(x, y) -> (read x, read (tail y))) . break (== ','))
    . lines

segments :: [Point] -> [(Point, Point)]
segments path = zip path (tail path)

main =
    print
    . round
    . (* 9)
    . (/ 1000)
    . sum
    . map (uncurry distanceBetween)
    . segments
    . parsePath
    =<< readFile "rute.txt"

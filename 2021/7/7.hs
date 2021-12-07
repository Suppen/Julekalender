type AntPos = Double
type BandLength = Integer

step :: (BandLength, AntPos) -> (BandLength, AntPos)
step (bandLength, antPos) = (newBandLength, newAntPos)
    where newBandLength = bandLength + 20
          stretchRatio  = fromIntegral newBandLength / fromIntegral bandLength
          newAntPos = antPos * stretchRatio + 1

main =
    print
    . (`div` 100)
    . fst
    . head
    . dropWhile (\(l, p) -> fromIntegral l > p)
    . iterate step
    $ (20, 1)

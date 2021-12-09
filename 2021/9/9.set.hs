import Data.Set (Set, intersection, fromDistinctDescList)

potentialNs :: Int -> Int -> Set Int
potentialNs rest niceChildren =
    fromDistinctDescList
    . map ((+ rest) . (* niceChildren))
    $ [maxPerChild, maxPerChild-1..minPerChild]
    where maxPerChild = 2000
          minPerChild = 1

nums :: [(Int, Int)]
nums = [
    (1854803357, 2424154637),
    (2787141611, 2807727397),
    (1159251923, 2537380333)
  ]

main =
    print
    . foldr1 intersection
    . map (uncurry potentialNs)
    $ nums

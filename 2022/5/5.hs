type Card = Int
type Deck = [Card]

riffleShuffle :: Deck -> Deck
riffleShuffle deck = concat $ zipWith (\a b -> [a, b]) firstHalf secondHalf
    where halfLength = length deck `div` 2
          (firstHalf, secondHalf) = splitAt halfLength deck

riffleShuffleMany :: Int -> Deck -> Deck
riffleShuffleMany n deck =
    foldr1 (.) (replicate n riffleShuffle) deck

main =
    print
    . length
    . fst
    . head
    . filter (uncurry (==))
    . map (\d -> (d, riffleShuffleMany 13 d))
    . map (\c -> [1..c])
    $ [54,56..]

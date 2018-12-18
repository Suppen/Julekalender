import Data.List (permutations)

type Point = (Double,Double)

calculateDistance :: [Point] -> Double
calculateDistance (_:[]) = 0
calculateDistance ((x1,y1):y@(x2,y2):zs) =
    sqrt((x2-x1)^2 + (y2-y1)^2) + calculateDistance (y:zs)

positions :: [Point]
positions = [
    (7.1,10.5),
    (18.8,9.2),
    (2.1,62.1),
    (74.2,1.5),
    (58.4,5.6),
    (15.9,6.2),
    (44.5,15.6),
    (88.1,53.4),
    (36.2,84.2),
    (26.9,8.5)
    ]

main =
    print
        . minimum
        . map calculateDistance
        . permutations
        $ positions
--        $ [(1.0,0.0),(3.0,0.0),(5.0,0.0)]

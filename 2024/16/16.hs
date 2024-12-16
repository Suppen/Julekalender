import Data.Bifunctor (bimap)
import Data.List (tails)

data Track = Sleeper | Air deriving (Eq, Show)

parseTrack :: Char -> Track
parseTrack '*' = Sleeper
parseTrack ' ' = Air
parseTrack _ = error "Invalid track"

data Ground = Sand | Gravel | Dirt deriving (Eq, Show)

parseGround :: Char -> Ground
parseGround 's' = Sand
parseGround 'g' = Gravel
parseGround 'j' = Dirt
parseGround _ = error "Invalid ground"

type Segment = (Track, Ground)

data BodyPart = Head | Neck | Torso | Butt | Legs deriving (Eq, Show)

elf :: [BodyPart]
elf = [Legs, Legs, Legs, Legs, Legs, Legs, Legs, Legs, Legs, Legs, Butt, Butt, Butt, Torso, Torso, Torso, Torso, Torso, Torso, Torso, Torso, Torso, Neck, Neck, Head, Head, Head, Head, Head]

parseSegments :: String -> [Segment]
parseSegments =
  map (bimap parseTrack parseGround)
    . (\[a, b] -> zip a b)
    . lines

isAcceptable :: [Segment] -> Bool
isAcceptable segments =
  let tuples = zip elf segments
      sleeperCount bodyPart = length $ filter (\(part, (track, _)) -> part == bodyPart && track == Sleeper) tuples
      groundCount bodyPart groundType = length $ filter (\(part, (_, ground)) -> part == bodyPart && ground == groundType) tuples
      totalSleepers = length . filter ((== Sleeper) . fst . snd) $ tuples
      headSleepers = sleeperCount Head
      neckSleepers = sleeperCount Neck
      neckSand = groundCount Neck Sand
      legSleepers = sleeperCount Legs
      noGravel = not . any ((== Gravel) . snd . snd) $ tuples
      allDirt = all ((== Dirt) . snd) segments
   in (headSleepers >= 1 && neckSleepers == 0 && neckSand == 0 && legSleepers <= 1 && noGravel) || (allDirt && totalSleepers == 0)

main = do
  segments <- parseSegments <$> readFile "el-paso_santa-cruz.txt"

  let acceptablePositions =
        filter isAcceptable
          . takeWhile ((==) (length elf) . length)
          . map (take (length elf))
          . tails
          $ segments

  print (length acceptablePositions)

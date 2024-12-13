import Control.Applicative ((<|>))
import Text.Parsec hiding ((<|>))
import Text.Parsec.String (Parser)

data Club = FCB | J | NT | NF | RC | SP | VM
  deriving (Show, Eq)

data Result = Win | Draw | Loss deriving (Show, Eq)

clubMultiplier :: Club -> Double
clubMultiplier FCB = 0.01
clubMultiplier J = 0.02
clubMultiplier NT = 0.01
clubMultiplier NF = 0.01
clubMultiplier RC = 0.03
clubMultiplier SP = 0.02
clubMultiplier VM = 0.03

data HomeAway = Home | Away
  deriving (Show, Eq)

data Match = Match
  { getOpponent :: Club,
    getPlayTime :: Int,
    getScore :: Int,
    getAssists :: Int,
    getGoals :: Int,
    getBest :: Bool
  }
  deriving (Show, Eq)

parseMatchLine :: String -> Either ParseError Match
parseMatchLine = parse matchParser ""

matchParser :: Parser Match
matchParser = do
  club <- clubParser
  char '/'
  playTime <- intParser
  char '/'
  ha <- homeAwayParser
  char '/'
  scoreVal <- scoreParser ha
  char '/'
  (assists, goals, best) <- flagsParser
  optional (char ',')
  eof
  return $ Match club playTime scoreVal assists goals best

clubParser :: Parser Club
clubParser =
  choice
    [ try (string "FCB" >> return FCB),
      try (string "J" >> return J),
      try (string "NT" >> return NT),
      try (string "NF" >> return NF),
      try (string "RC" >> return RC),
      try (string "SP" >> return SP),
      try (string "VM" >> return VM)
    ]

intParser :: Parser Int
intParser = read <$> many1 digit

homeAwayParser :: Parser HomeAway
homeAwayParser = (char 'H' >> return Home) <|> (char 'B' >> return Away)

scoreParser :: HomeAway -> Parser Int
scoreParser homeAway = do
  x <- intParser
  char '-'
  y <- intParser
  return (if homeAway == Home then x - y else y - x)

flagsParser :: Parser (Int, Int, Bool)
flagsParser = do
  flags <- many (oneOf "ASB")
  let assists = length (filter (== 'A') flags)
      goals = length (filter (== 'S') flags)
      best = 'B' `elem` flags
  return (assists, goals, best)

calculateSalary :: Double -> Match -> (Double, Double)
calculateSalary incentive (Match opponent playTime score assists goals best) =
  let result
        | score > 0 = Win
        | score < 0 = Loss
        | otherwise = Draw
      baseSalary = fromIntegral playTime * 100
      goalMultiplier = fromIntegral score * 0.05
      goalScorerMultiplier = fromIntegral goals * 0.02
      assistMultiplier = fromIntegral assists * 0.01
      bestMultiplier
        | best = 0.02
        | otherwise = 0
      opponentMultiplier =
        let multiplier = clubMultiplier opponent
         in if result == Win then multiplier else if result == Loss then -multiplier else 0
      winMultiplier
        | result == Win = incentive
        | otherwise = 0
      multiplier =
        goalMultiplier
          + goalScorerMultiplier
          + assistMultiplier
          + bestMultiplier
          + opponentMultiplier
          + winMultiplier
      newIncentive
        | result == Win = 0
        | result == Loss && incentive == 0 = 0.03
        | result == Loss = incentive + 0.01
        | result == Draw = incentive
   in (newIncentive, baseSalary * (1 + multiplier))

main = do
  matches <- mapM parseMatchLine . lines <$> readFile "salary.txt"

  let Right (_, totalSalary) = foldl (\(incentive, totalSalary) match -> let (newIncentive, salary) = calculateSalary incentive match in (newIncentive, totalSalary + salary)) (0.0, 0.0) <$> matches

  print totalSalary

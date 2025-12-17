data Command = RollSmall | RollMedium | RollBig | Stack | Hat | Carrot deriving (Show, Eq)

type Snowmen = (
  -- Big snowballs
  Int,
  -- Medium snowballs
  Int,
  -- Small snowballs
  Int,
  -- Stacked big and medium snowballs
  Int,
  -- Ready for decoration (big, med, and small)
  Int,
  -- Has a hat, but no carrot
  Int,
  -- Has a carrot, but no hat
  Int,
  -- Complete snowmen
  Int
 )

parseInput :: String -> [Command]
parseInput = map parseCommand . lines
  where parseCommand :: String -> Command
        parseCommand "ROLL" = RollSmall
        parseCommand "ROLL ROLL" = RollMedium
        parseCommand "ROLL ROLL ROLL" = RollBig
        parseCommand "STACK" = Stack
        parseCommand "HAT" = Hat
        parseCommand "CARROT" = Carrot

processCommand :: Snowmen -> Command -> Snowmen
-- Roll a big snowball
processCommand (big, medium, small, halfReady, ready, hasHat, hasCarrot, complete) RollBig =
    (big + 1, medium, small, halfReady, ready, hasHat, hasCarrot, complete)
-- Roll a medium snowball
processCommand (big, medium, small, halfReady, ready, hasHat, hasCarrot, complete) RollMedium =
    (big, medium + 1, small, halfReady, ready, hasHat, hasCarrot, complete)
-- Roll a small snowball
processCommand (big, medium, small, halfReady, ready, hasHat, hasCarrot, complete) RollSmall =
    (big, medium, small + 1, halfReady, ready, hasHat, hasCarrot, complete)
-- Stack
processCommand snowmen@(big, medium, small, halfReady, ready, hasHat, hasCarrot, complete) Stack
    -- There is a small snowball to put on top of a half-ready snowman
    | halfReady > 0 && small > 0 = (big, medium, small - 1, halfReady - 1, ready + 1, hasHat, hasCarrot, complete)
    -- There is a medium snowball to put on top of a big snowball
    | big > 0 && medium > 0      = (big - 1, medium - 1, small, halfReady + 1, ready, hasHat, hasCarrot, complete)
    -- Nothing to stack. Impossible command
    | otherwise                  = snowmen
-- Put a hat on a snowman
processCommand snowmen@(big, medium, small, halfReady, ready, hasHat, hasCarrot, complete) Hat
     -- There is a snowman with a carrot
    | hasCarrot > 0 = (big, medium, small, halfReady, ready, hasHat, hasCarrot - 1, complete + 1)
    -- There is a fully stacked snowman with no decorations
    | ready > 0     = (big, medium, small, halfReady, ready - 1, hasHat + 1, hasCarrot, complete)
    -- There are no snowmen ready for a hat. Impossible command
    | otherwise     = snowmen
-- Put a carrot on a snowman
processCommand snowmen@(big, medium, small, halfReady, ready, hasHat, hasCarrot, complete) Carrot
    -- There is a snowman with a hat
    | hasHat > 0 = (big, medium, small, halfReady, ready, hasHat - 1, hasCarrot, complete + 1)
    -- There is a fully stacked snowman with no decorations
    | ready > 0  = (big, medium, small, halfReady, ready - 1, hasHat, hasCarrot + 1, complete)
    -- There are no snowmen ready for a carrot. Impossible command
    | otherwise  = snowmen

main = do
    commands <- parseInput <$> readFile "commands.txt"

    let (_, _, _, _, _, _, _, complete) = foldl processCommand (0, 0, 0, 0, 0, 0, 0, 0) commands

    print complete

    -- XXX: For some mighty strange reason, the accepted answer is one less than this code gives. Everyone else in the
    -- comments section got the same answer as me, and nobody understands why it should be one less

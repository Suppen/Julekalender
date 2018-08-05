import qualified Control.Monad.State
import Data.Maybe (isJust, fromJust)
import Data.List (delete)

data Adventurer = Thief | Warrior | Wizard | Cleric deriving (Show)

type Room = Int
type LiveAdventurers = [Adventurer]
type DeadAdventurer = Maybe Adventurer
type Goblins = Int
type Survivors = Int
type HasRevivedInThisRoom = Boolean

type DungeonState = (LiveAdventurers, DeadAdventurer, HasRevivedInThisRoom, Goblins, Survivors)

isAlive :: Adventurer -> LiveAdventurers -> Boolean
isAlive adventurer adventurers = adventurer `elem` adventurers

step1 :: DungeonState -> ((), DungeonState)
step1 state@(liveAdventurers, dead, hasRevived, goblins, survivors)
    | isAlive Thief liveAdventurers = (liveAdventurers, dead, hasRevived, (goblins - kills), survivors)
    | otherwise                     = state
    where kills = min 1 goblins

step2 :: DungeonState -> ((), DungeonState)
step2 state@(liveAdventurers, dead, hasRevived, goblins, survivors)
    | isAlive Wizard liveAdventurers = (liveAdventurers, dead, hasRevived, (goblins - kills), survivors)
    | otherwise                      = state
    where kills = min 10 goblins

step3 :: DungeonState -> ((), DungeonState)
step3 state@(liveAdventurers, dead, hasRevived, goblins, survivors)
    | isAlive Warrior liveAdventurers = (liveAdventurers, dead, hasRevived, (goblins - kills), survivors)
    | otherwise                       = state
    where kills = min 1 goblins

step4 :: DungeonState -> ((), DungeonState)
step4 state@(liveAdventurers, dead, hasRevived, goblins, survivors)
    | isAlive Cleric liveAdventurers && isJust dead && not hasRevived = ((fromJust dead:liveAdventurers), Nothing, True, goblins, survivors)
    | otherwise                                                       = state

step5 :: LiveAdventurers -> Boolean
step5 = isAlive Thief

step6 :: DungeonState -> ((), DungeonState) 
step6 state@(liveAdventurers, dead, hasRevived, goblins, survivors)
    | goblins >= 10 * length liveAdventurers = (remaining, died, hasRevived, goblins, survivors)
    | otherwise                   = state
    where (remaining, died) = kill liveAdventurers
          kill liveAdventurers
              | isAlive Warrior liveAdventurers = (Just Warrior, delete Warrior liveAdventurers)
              | isAlive Wizard liveAdventurers  = (Just Wizard, delete Wizard liveAdventurers)
              | isAlive Cleric liveAdventurers  = (Just Cleric, delete Cleric liveAdventurers)
              | otherwise            = (Nothing, liveAdventurers)

step7 :: DungeonState -> ((), DungeonState) 
step7 state@(liveAdventurers, dead, hasRevived, goblins, survivors)

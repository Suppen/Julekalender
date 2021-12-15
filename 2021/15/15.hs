import System.IO (writeFile)
import qualified Data.Map.Strict as M;
import Control.Monad (join, foldM)
import Control.Applicative (liftA2)
import Data.List (isInfixOf)
import Data.Maybe (isJust, fromJust)

type Key = (Int, String)
type Cleartext = String
type Cipher = String
type CleartextBlock = String
type CipherBlock = String

alphabet :: String
alphabet = "abcdefghijklmnopqrstuvwxyzæøå"

intToChar :: Int -> Maybe Char
intToChar n = M.lookup n' . M.fromList $ zip [1..] alphabet
    where n' = (+1) . (`mod` length alphabet) . (subtract 1) $ n

charToInt :: Char -> Maybe Int
charToInt c = M.lookup c . M.fromList $ zip alphabet [1..]

valueChars :: M.Map Int Char
valueChars = M.fromList $ zip [0..] alphabet

asKey :: String -> Key
asKey str = (length str, take 8 $ str ++ repeat 'x')

toBlocks :: String -> [String]
toBlocks [] = []
toBlocks str = take 8 str : toBlocks (drop 8 str)

decryptBlock :: Key -> CipherBlock -> Int -> Maybe CleartextBlock
decryptBlock (keyLen, key) block blockIndex =
    -- Flatten the resulting maybe
    join
    -- Convert everything back to characters
    . fmap (sequence . map intToChar)
    . join
    -- Subtract the key from the character
    . fmap (sequence . zipWith (liftA2 subtract) (map charToInt key) . map pure)
    -- Subtract the character's index
    . fmap (zipWith subtract [1..])
    -- Subtract the key's length multiplied by the block's index from each char
    . sequence
    . map (fmap (subtract (keyLen * blockIndex)) . charToInt)
    $ block

encryptBlock :: Key -> CleartextBlock -> Int -> Maybe CipherBlock
encryptBlock (keyLen, key) block blockIndex =
    -- Flatten the resulting maybe
    join
    -- Convert everything back to characters
    . fmap (sequence . map intToChar)
    -- Add the key's length multiplied by the block index to each character
    . fmap (map (+ (keyLen * blockIndex)))
    -- Add the character's index
    . fmap (zipWith (+) [1..])
    -- Applicatively merge the key and block
    . sequence
    $ zipWith (liftA2 (+)) (map charToInt key) (map charToInt block)

decrypt :: String -> Cipher -> Maybe Cleartext
decrypt keyStr str = fmap (concat . reverse) $ foldM fn [] indexedBlocks
    where key = asKey keyStr
          blocks = toBlocks str
          indexedBlocks = zip [1..] blocks
          fn decrypted (blockIndex, block) = (:decrypted) <$> decryptBlock key block blockIndex

encrypt :: String -> Cleartext -> Maybe Cipher
encrypt keyStr str = fmap (concat . reverse) $ foldM fn [] indexedBlocks
    where key = asKey keyStr
          blocks = toBlocks str
          indexedBlocks = zip [1..] blocks
          fn encrypted (blockIndex, block) = (:encrypted) <$> encryptBlock key block blockIndex

encrypted :: [String]
encrypted = [
    "wawwgjlmwkafeosjoæiralop",
    "jagwfjsuokosjpzæynzxtxfnbæjkæalektfamxæø",
    "wawwgjlmwkoåeosaæeoltååøbupscpfzqehkgdhkjdoqqkuuakvwogjkpøjsbmpq",
    "vttyøyønøbjåiåzpejsimøldajjecnbplåkyrsliænhbgkvbecvdscxømrvåmagdioftvivwøkvbnyøå"
  ]

main = do
    let words = (\e f -> ['a','l','v','a',e,f]) <$> alphabet <*> alphabet

    writeFile "results"
        . concat
        . map ((++ "\n") . show)
        . filter (("jul" `isInfixOf`) . fromJust . fst)
        . filter (isJust . fst)
        . map (\word -> (decrypt word (head encrypted), word))
        $ words

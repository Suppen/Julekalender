import Data.Bits (Bits (xor))
import Data.ByteString qualified as BS
import Data.Text.Encoding qualified as TE
import Data.Text.IO qualified as TIO
import Data.Word (Word8)

decryptPassword :: [Word8] -> [Word8]
decryptPassword list =
  let decrypted = head list : zipWith xor decrypted (tail list)
   in decrypted

main = do
  cipher <- BS.unpack <$> BS.readFile "kryptert.txt"
  let decrypted = TE.decodeUtf8 . BS.pack $ decryptPassword cipher

  TIO.putStrLn decrypted

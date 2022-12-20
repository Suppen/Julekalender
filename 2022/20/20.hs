import qualified Data.Set as S

type Pos = (Int, Int)
type Path = String

data Elf = Elf Pos Path deriving (Show)

parseElves :: FilePath -> IO [Elf]
parseElves filename =
    return
    . map (
          (\(pos, path) -> Elf (read pos) path)
          . break (flip elem "nsevg")
          )
    . tail
    . lines
    =<< readFile filename

elfWalk :: Elf -> S.Set Pos -> S.Set Pos
elfWalk (Elf _ []) glogg              = glogg
elfWalk (Elf pos ('\r':path)) glogg   = elfWalk (Elf pos path) glogg
elfWalk (Elf (x, y) ('n':path)) glogg = elfWalk (Elf (x, y + 1) path) glogg
elfWalk (Elf (x, y) ('s':path)) glogg = elfWalk (Elf (x, y - 1) path) glogg
elfWalk (Elf (x, y) ('e':path)) glogg = elfWalk (Elf (x + 1, y) path) glogg
elfWalk (Elf (x, y) ('v':path)) glogg = elfWalk (Elf (x - 1, y) path) glogg
elfWalk (Elf pos ('g':path)) glogg    = elfWalk (Elf pos path) (S.insert pos glogg)

main = do
    elves <- parseElves "alv_sti.txt"

    let answer = S.size . mconcat $ map (flip elfWalk S.empty) elves

    print answer

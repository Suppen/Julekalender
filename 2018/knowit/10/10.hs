import System.IO (readFile)

type Stack = [Int]

-- Operators
colon :: Stack -> Stack
colon xs = sum xs : []

pipe :: Stack -> Stack
pipe xs = 3 : xs

quote :: Stack -> Stack
quote (x:y:ys) = x+y : ys

dot :: Stack -> Stack
dot (a:b:bs) = b-a : a-b : bs

underscore :: Stack -> Stack
underscore (a:b:bs) = a : a*b : bs

slash :: Stack -> Stack
slash (x:xs) = xs

i :: Stack -> Stack
i (x:xs) = x : x : xs

backslash :: Stack -> Stack
backslash (x:xs) = x+1 : xs

star :: Stack -> Stack
star (a:b:bs)
    | res < 0   = res+1 : bs
    | otherwise = res : bs
    where res = a `div` b

rightbracket :: Stack -> Stack
rightbracket (x:xs)
    | x `mod` 2 == 0 = 1 : xs
    | otherwise      = xs

leftbracket :: Stack -> Stack
leftbracket (x:xs)
    | x `mod` 2 == 1 = x : xs
    | otherwise      = xs

tilde :: Stack -> Stack
tilde (x:y:z:zs) = maximum [x,y,z] : zs

space :: Stack -> Stack
space xs = 31 : xs

-- The executor
runProgram :: String -> Stack
runProgram p = foldl exe [] p'
    where p' = concat
                   . map (takeWhile (/= 'K'))
                   . lines
                   $ p
          exe s c
              | c == ':' = colon s
              | c == '|' = pipe s
              | c == '\'' = quote s
              | c == '.' = dot s
              | c == '_' = underscore s
              | c == '/' = slash s
              | c == 'i' = i s
              | c == '\\' = backslash s
              | c == '*' = star s
              | c == ']' = rightbracket s
              | c == '[' = leftbracket s
              | c == '~' = tilde s
              | c == ' ' = space s

-- Main
main = do
    content <- readFile "input.spp"
    print
        . maximum
        . runProgram
        $ content

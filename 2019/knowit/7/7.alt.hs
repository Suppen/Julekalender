codeForDay :: Int -> Int
codeForDay x = z `rem` magicNumber
    where magicNumber = 27644437
          specialDividend = 5897
          y = let isGood y' = let b = y' * x
                                  r = b `rem` magicNumber
                              in  r == 1
              in  head . filter isGood $ [2..magicNumber-1]
          z = specialDividend * y
                                  
main = print . map codeForDay $ [2..24]

programmersFridays :: Int -> Int -> Int -> Int
programmersFridays 0 _ fridays = fridays
programmersFridays year day fridays = let day1 = if isLeapYear year
                                                 then day-2
                                                 else day-1
                                          day2 = if day1 < 0
                                                 then day1+7
                                                 else day1
                                          fridayAcc = if day2 == 4
                                                      then fridays+1
                                                      else fridays
                                      in  programmersFridays (year-1) day2 fridayAcc

isLeapYear :: Int -> Bool
isLeapYear = do
    divisibleBy4 <- (==0) . (`mod` 4)
    divisibleBy100 <- (==0) . (`mod` 100)
    divisibleBy400 <- (==0) . (`mod` 400)
    return (divisibleBy4 && not divisibleBy100 && divisibleBy400)

main = do
    putStrLn $ show $ programmersFridays 2015 6 0

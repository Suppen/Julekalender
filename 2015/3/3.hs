programmersFridays :: Int -> Int -> Int -> Int
programmersFridays 0 _ fridays = fridays
programmersFridays year day fridays = let day1 = day-1
                                          day2 = if isLeapYear year
                                                 then day1-1
                                                 else day1
                                          day3 = if day2 < 0
                                                 then day2+7
                                                 else day2
                                          fridayAcc = if day3 == 4
                                                      then fridays+1
                                                      else fridays
                                      in  programmersFridays (year-1) day3 fridayAcc

isLeapYear :: Int -> Bool
isLeapYear year = year `mod` 4 == 0 && year `mod` 100 /= 0 && year `mod` 400 == 0

main = do
    putStrLn $ show $ programmersFridays 2015 6 0

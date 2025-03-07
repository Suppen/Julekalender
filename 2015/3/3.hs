programmersFridays :: Int -> Int -> Int -> Int
programmersFridays 0 _ fridays = fridays
programmersFridays year day fridays = let day1 = if isLeapYear year
                                                 then day-2
                                                 else day-1
                                          day2 = if day1 < 0
                                                 then day1+7
                                                 else day1
                                      in  programmersFridays (year-1) day2 (if day2 == 4 then fridays+1 else fridays)

isLeapYear :: Int -> Bool
isLeapYear year = year `mod` 4 == 0 && year `mod` 100 /= 0 && year `mod` 400 == 0

main = do
    putStrLn $ show $ programmersFridays 2015 6 0

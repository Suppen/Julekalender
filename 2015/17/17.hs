import Data.Time

epochStart :: UTCTime
epochStart = UTCTime (fromGregorian 1814 5 17) (13*3600 + 37*60 + 14)

timeToCheck :: UTCTime
timeToCheck = UTCTime (fromGregorian 2015 9 17) (17*3600 + 15*60)

main = putStrLn $ show $ diffUTCTime timeToCheck epochStart

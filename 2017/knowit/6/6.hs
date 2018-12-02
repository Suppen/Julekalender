import System.IO (readFile)

type Lat = Double
type Lon = Double

data Coords = Coords Lat Lon

-- | Coordinates of Oslo
oslo :: Coords
oslo = Coords 59.911491 10.757933

-- | Speed of Santa, in km/h
santaSpeed :: Double
santaSpeed = 7274

-- | Calculates the distance, in km, between two global coordinates
haversine :: Coords -> Coords -> Double
haversine (Coords lat1 lon1) (Coords lat2 lon2) = 2 * r * asin (sqrt a)
    where r = 6371 -- Radius of the earth, in km
          deg2rad deg = deg * pi / 180
          lat1rad = deg2rad lat1
          lat2rad = deg2rad lat2
          latDiff = lat2rad - lat1rad
          lonDiff = deg2rad (lon2 - lon1)
          a = (sin (latDiff / 2))^2 + cos lat1rad * cos lat2rad * (sin (lonDiff / 2))^2

-- | Calculates the distance from Oslo to a point, in km
distanceFromOslo :: Coords -> Double
distanceFromOslo = haversine oslo


Jeg skjønte med en gang at brute force av denne ville være helt håpløst,  så jeg har brukt en del timer på å finne en matematisk løsning.
Jeg laget etterhvert en Haskellsnutt som genererer alle koordinater Sneglulf snur på:

```hs
northSteps :: [Integer]
northSteps = filter ((/= 0) . (`mod` 5)) $ [3, 6 ..]

eastSteps :: [Integer]
eastSteps = filter ((/= 0) . (`mod` 3)) $ [5, 10 ..]

turnCoords :: [(Integer, Integer)]
turnCoords = ((0, 0) :) $ zip
    (0 : (eastSteps >>= replicate 2))
    (northSteps >>= replicate 2)
```````

Disse skrev jeg så til fil, og plottet i gnuplot:
![plot](https://x.suppen.no/knowit-julekalender-2021-4-plot.png)

Jeg la merke til at det ved jevne mellomrom dukket opp noen enslige koordinater, markert med rødt i plottet. Jeg fant koordinatene til disse, og fant en formel for å generere dem:

```hs
points n = (30 * n - 5, 15 * n + 3)
```````

Ettersom jeg visste at summen av koordinatene er lik steget man er på, var det bare å slå dem sammen og sette dem lik steget Sneglulf skulle stoppe på, her kalt N:

```
30n - 5 + 15n + 3 = N
n = (2 + N) / 45
```````

Dette ga `n = 2222222222222222224`. Putter man dette inn i formelen får man `(66666666666666666715,33333333333333333363)`. Summen av disse er én mindre enn N, så da var det bare å plusse på 1 på en av dem og prøve. Funket ikke det, måtte det være +1 på den andre.

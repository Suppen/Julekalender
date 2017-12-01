"use strict";

// Løst med kalkulator
// 
// Antall sekunder: (2^31) - 1 = 2147483647 (maxverdi på signed 4-bit integer)
// Antall timer: 2147483647 / 3600 = 596523,235277778
// Antall dager: 596523,235277778 / 25 = 23860,929411111
// Antall skuddager: Jeg regnet om antall dager til antall år og plusset på 1970, og fikk 2035. Begynte med 1972 (som er et skuddår) i kalkulatoren og telte hvor mange ganger jeg plusset på 4 til jeg kom til 1935. Trakk fra 1 fordi 2000 ikke var et skuddår, og fikk 15 skuddager
// Antall dager: 23860,929411111 - 15 = 23845,929411111
// Antall år: 23845,929411111 / 365 = 65,331313455
// Årstall: 1970 + 65,331313455 = 2035,331313455. Dropp desimalene, og vi får 2035
// Dag: 0,331313455 * 365 = 120,929411075. Altså 120. dag i året, som iflg. Wikipedia er 30. april
// Time: 0,929411075 * 25 = 23,235276875. Dropp desimalene, og vi får 23
// Minutt: 0,235276875 * 60 = 14,1166125. Dropp desimalene, og vi får 14
// Sekund: 0,1166125 * 60 = 6,99675. Dropp desimalene, og vi får 6. Overflowen skjer sekundet etter, så 7
// 
// Satt sammen: 2035-04-30T23:14:07Z

console.time();

console.log("2035-04-30T23:14:07Z");

console.timeEnd();

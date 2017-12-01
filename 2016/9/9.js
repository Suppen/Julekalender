"use strict";

// Les transaksjonsfilen
const fs = require("fs");
let transaksjoner = fs.readFileSync("transaksjoner.txt", "utf-8");

// Start timer
console.time()

// Objekt som holder styr på kontoene
let kontoer = {None: Number.POSITIVE_INFINITY};

// Utfør transaksjoner
transaksjoner.split("\r\n").forEach(t => {
	let [fra, til, belop] = t.split(",");
	belop = Number.parseInt(belop);

	if (kontoer[til] === undefined) {
		kontoer[til] = 0;
	}
	kontoer[til] += belop;
	kontoer[fra] -= belop;
});

// Slett None-kontoen
delete kontoer.None;

// Sjekk hvor mange som har mer enn 10 penger
let over10 = 0;
for (let konto in kontoer) {
	if (kontoer[konto] > 10) {
		over10++;
	}
}

// Print svaret
console.log(over10);
console.timeEnd();

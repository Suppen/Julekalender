"use strict";

// Les filen
const fs = require("fs");
const readline = require("readline");

// Start timer
console.time();

// Hold styr på spillerne. Spiller 0 brukes ikke, så indeksene 1-1337 er i bruk
let spillere = new Array(1338).fill(1);

// Definer stiger
let stiger = {3: 17, 8: 10, 15: 44, 22: 5, 39: 56, 49: 75, 62: 45, 64: 19, 65: 73, 80: 12, 87: 79};

// Les filen linje for linje
let terningkaster = readline.createInterface({
	input: fs.createReadStream("terningkast.txt", "utf-8")
});

// Variabler for å holde styr på ting
let ferdig = false;
let spiller = 0;
let stigerBrukt = 0;

// Spill!
terningkaster.on("line", terning => {
	// Kast terningen
	terning = Number.parseInt(terning);

	// Øk spillernummber
	if (++spiller > 1337) {
		spiller = 1;
	}

	// Flytt
	spillere[spiller] += terning;
	if (spillere[spiller] > 90) {
		// For langt. Flytt tilbake
		spillere[spiller] -= terning;
	} else if (stiger[spillere[spiller]] !== undefined) {
		// Spilleren traff en stige. Flytt til enden av stigen
		spillere[spiller] = stiger[spillere[spiller]];
		stigerBrukt++;
	} else if (spillere[spiller] === 90) {
		// Spilleren vant!!!!
		terningkaster.close();
	}
});

// Kasteren lukkes når en spiller vinner
terningkaster.on("close", () => {
	// Print resultatet
	console.log(spiller * stigerBrukt);

	// Print tidsforbruk
	console.timeEnd();
}); 

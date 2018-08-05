"use strict";

// Les filen
const fs = require("fs");
let terningkast = fs.readFileSync("terningkast.txt", "utf-8");

// Start timer
console.time();

// Hold styr på spillerne. Spiller 0 brukes ikke, så indeksene 1-1337 er i bruk
let spillere = new Array(1338).fill(1);

// Definer stiger
let stiger = {3: 17, 8: 10, 15: 44, 22: 5, 39: 56, 49: 75, 62: 45, 64: 19, 65: 73, 80: 12, 87: 79};

// Parse alle terningkast til tall
terningkast = terningkast.split("\r\n").map(n => Number.parseInt(n)).reverse();

// Variabler for å holde styr på ting
let ferdig = false;
let spiller = 0;
let stigerBrukt = 0;

// Spill!
while (!ferdig) {
	// Øk spillernummber
	if (++spiller > 1337) {
		spiller = 1;
	}

	// Kast terningen
	let terning = terningkast.pop();

	// Flytt
	spillere[spiller] += terning;
	if (spillere[spiller] > 90) {
		// For langt. Flytt tilbake
		spillere[spiller] -= terning;
	} else if (spillere[spiller] === 90) {
		// Spilleren vant!!!!
		ferdig = true;
	} else if (stiger[spillere[spiller]] !== undefined) {
		// Spilleren traff en stige. Flytt til enden av stigen
		spillere[spiller] = stiger[spillere[spiller]];
		stigerBrukt++;
	}
}

// Print resultatet
console.log(spiller * stigerBrukt);

// Print tidsforbruk
console.timeEnd();

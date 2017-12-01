"use strict";

// Start en timer
console.time();

/**
 * Finner tverrsummen av et tall
 *
 * @param {Integer} tall	Tallet å finne tverrsummen av
 *
 * @return {Integer}	Tallets tverrsum
 */
function tverrsum(tall) {
	return (""+tall).split("").reduce((tverrsum, siffer) => tverrsum + Number.parseInt(siffer), 0);
}

// Finn lavest mulig kube og begynn søket på den
let i = Math.ceil(Math.cbrt(100000));
let n;

// Tallet som skal finnes
let tall = null;

// Sjekk om noen kuber har tverrsum 43
do {
	// Kuber tallet
	n = i**3;

	// Sjekk om tverrsummen er 43
	if (tverrsum(n) === 43) {
		// Sjekk om tallet er et kvadrat
		let erKvadrat = Number.isInteger(Math.sqrt(n));

		// Sjekk om tallet er under 500000
		let erLavt = n < 5000000;

		if (erKvadrat ^ erLavt) {
			// Dette er tallet!
			tall = n;
		}
	}

	// Inkrementer i
	i++;
} while (n < 1000000 && tall === null);

// Hvis det ikke var en kube, må det nødvendigvis være de to andre påstandene som er riktige
if (tall === null) {
	// Finn lavest mulig kvadrat
	i = Math.ceil(Math.sqrt(100000));
	do {
		// Kvadrer tallet
		n = i**2;

		// Sjekk tverrsummen
		if (tverrsum(n) === 43) {
			tall = n;
		}

		// Inkrementer i
		i++;
	} while (n < 500000 && tall === null);
}

console.log(tall);
console.timeEnd();

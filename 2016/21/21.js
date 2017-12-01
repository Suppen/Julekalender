"use strict";

// Last trekanten
const fs = require("fs");
const fil = fs.readFileSync("trekant.txt", "utf-8");

// Start en timer
console.time();

// Parse filen som trekant A
let A = fil.split("\r\n").map(linje => linje.split(" ").map(tall => Number.parseInt(tall)));

/**
 * Roterer en trekant 120 grader mot klokken
 *
 * @param {Array[]} trekant	Trekanten som skal roteres
 *
 * @return {Array[]}	Den roterte trekanten
 */
function roter(trekant) {
	// Opprett den nye trekanten som et kvadrat
	let nyTrekant = [];
	for (let i = 0; i < trekant.length; i++) {
		nyTrekant.push(new Array(trekant.length));
	}

	// Kopier verdier fra den opprinnelige trekanten inn i sine roterte posisjoner på den nye trekanten
	for (let y = 0; y < trekant.length; y++) {
		for (let x = 0; x < trekant.length; x++) {
			nyTrekant[trekant.length-x-1][y] = trekant[y][x];
		}
	}

	// Fjern alle "undefined"-verdier
	for (let i = 0; i < nyTrekant.length; i++) {
		while (nyTrekant[i][0] === undefined) {
			nyTrekant[i].shift();
		}
	}

	// Alt klart!
	return nyTrekant;
}

// Definer de to andre trekantene
let B = roter(A);
let C = roter(B);

/**
 * Finner verdien av beste vei fra toppen til bunnen i en trekant. NB! Ødelegger trekanten i prosessen
 *
 * @param {Array[]} trekant	Trekanten veien skal finnes i
 *
 * @return {Integer}	Verdien av beste vei gjennom trekanten
 */
function finnBesteVei(trekant) {
	// Traverser trekanten baklengs, fra nest siste linje til toppen
	for (let y = trekant.length-2; y >= 0; y--) {
		for (let x = trekant[y].length-1; x >= 0; x--) {
			// For celle [x, y], ta verdien i celle [x, y] og legg til det høyeste av de to tallene direkte under, altså [x, y+1], [x+1, y+1]
			trekant[y][x] = trekant[y][x] + Math.max(trekant[y+1][x+1], trekant[y+1][x]);
		}
	}

	// Verdien av beste vei ligger nå på toppen av trekanten
	return trekant[0][0];
}

// Print resultatet
console.log("A" + finnBesteVei(A));
console.log("B" + finnBesteVei(B));
console.log("C" + finnBesteVei(C));
console.timeEnd();

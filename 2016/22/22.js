"use strict";

// Les rektangelfilen
const fs = require("fs");
let rektangelregioner = fs.readFileSync("rektangelregioner.json", "utf-8");

// Start en timer
console.time();

// Parse filen. Endelig JSON!
rektangelregioner = JSON.parse(rektangelregioner);

/**
 * Lager et pent grid
 *
 * @param {Object} koordinater	Et objekt med griddets max- og min-koordinater
 * @param {Integer} minX	Minste X-koordinat i griddet
 * @param {Integer} maxX	Største X-koordinat i griddet
 * @param {Integer} minY	Minste Y-koordinat i griddet
 * @param {Integer} maxY	Største Y-koordinat i griddet
 * 
 * @return {Object}	Et objekt med gridstruktur (x og y-koordinater);
 */
function lagGrid({minX, minY, maxX, maxY}) {
	let grid = {};	// Koordinatene kan være negative. Objekter håndterer dette bedre enn arrays
	for (let y = minY; y <= maxY; y++) {
		grid[y] = {};
		for (let x = minX; x <= maxX; x++) {
			grid[y][x] = 0;
		}
	}

	return grid;
}

/**
 * Finner dimensjonene på griddet basert på rektangelregioner
 *
 * @param {Array[]] rektangler	En rektangelregion
 *
 * @return {Object}	Objekt med max- og min-koordinater i regionen
 */
function finnKoordinater(rektangler) {
	let koordinater = {
		minX: Number.POSITIVE_INFINITY,
		minY: Number.POSITIVE_INFINITY,
		maxX: Number.NEGATIVE_INFINITY,
		maxY: Number.NEGATIVE_INFINITY
	};
	rektangler.forEach(([x0, y0, x1, y1]) => {
		koordinater.minX = Math.min(koordinater.minX, x0, x1);
		koordinater.maxX = Math.max(koordinater.maxX, x0, x1);
		koordinater.minY = Math.min(koordinater.minY, y0, y1);
		koordinater.maxY = Math.max(koordinater.maxY, y0, y1);
	});
	koordinater.maxX--;
	koordinater.maxY--;

	return koordinater;
}

// Gå gjennom rektangelregionene
let resultater = rektangelregioner.map((rektangler, i) => {
	// Finn max- og min-koordinater i griddet
	let koordinater = finnKoordinater(rektangler);

	// Lag et grid
	let grid = lagGrid(koordinater);

	// Putt rektanglene inn i griddet
	rektangler.forEach(([x0, y0, x1, y1]) => {
		for (let y = y0; y < y1; y++) {
			for (let x = x0; x < x1; x++) {
				grid[y][x]++;
			}
		}
	});

	// Hvis det er en eneste celle med noe annet enn 1 i griddet, bygger ikke rektanglene ett større rektangel
	let erOk = true;
	for (let y = koordinater.maxY; erOk && y >= koordinater.minY; y--) {
		for (let x = koordinater.minX; erOk && x <= koordinater.maxX; x++) {
			erOk = grid[y][x] === 1;
		}
	}

	return erOk;
});

// Print resultatene
console.log(resultater.join(", "));
console.timeEnd();

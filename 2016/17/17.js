"use strict";

// Last inn ormehullfilen
const fs = require("fs");
let ormehull = fs.readFileSync("ormehull.txt", "utf-8");

// Start en timer
console.time();

// Del ormehullfilen opp i linjer
ormehull = ormehull.split("\r\n");

// Siste linje er tom. Fjern den
ormehull.pop();

/**
 * Representerer ormehull
 */
class Ormehull {
	/**
	 * Oppretter et nytt ormehull
	 *
	 * @param {Integer} fraX	X-koordinat ormehullet befinner seg på
	 * @param {Integer} fraY	Y-koordinat ormehullet befinner seg på
	 * @param {Integer} tilX	X-koordinat ormehullet går til
	 * @param {Integer} tilY	Y-koordinat ormehullet går til
	 */
	constructor(fraX, fraY, tilX, tilY) {
		/** Koordinatene hullet går fra */
		this.fra = {x: fraX, y: fraY};
		/** Koordinatene hullet går til */
		this.til = {x: tilX, y: tilY};
	}
}

// Opprett alle hull
let alleHull = [];
const parseRegexp = /(\d+),(\d+)-(\d+),(\d+)/;
ormehull.forEach(hull => {
	// Parse hullet
	let [ , x0, y0, x1, y1] = parseRegexp.exec(hull);

	// Opprett hullobjekter og putt de i kartet
	let hull1 = new Ormehull(x0, y0, x1, y1);
	let hull2 = new Ormehull(x1, y1, x0, y0);
	alleHull.push(hull1, hull2);
});

// Lag dummyhull på start- og sluttkoordinatene
let starthull = new Ormehull(-Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER, 0, 0);
let slutthull = new Ormehull(99999, 99999, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
alleHull.push(starthull, slutthull);

// Regn ut gangavstanden mellom hull a sin inngang til hull b sin utgang
let avstander = new Map();
alleHull.forEach(hull1 => {
	// Opprett avstandskart fra dette hullets ende til alle hulls inngang
	avstander.set(hull1, new Map());

	alleHull.forEach(hull2 => {
		// Regn ut avstanden
		let avstand = Math.abs(hull1.til.x - hull2.fra.x) + Math.abs(hull1.til.y - hull2.fra.y);

		// Putt det på avstandskartet
		avstander.get(hull1).set(hull2, avstand);
	});
});

// Dijkstra
let dist = new Map();

alleHull.forEach(hull => {
	dist.set(hull, Number.POSITIVE_INFINITY);
});

dist.set(starthull, 0);

while (alleHull.length > 0) {
	let u = alleHull.reduce((kortest, hull) => {
		if (dist.get(hull) < dist.get(kortest)) {
			return hull;
		} else {
			return kortest;
		}
	});
	alleHull.splice(alleHull.indexOf(u), 1);

	avstander.get(u).forEach((avstand, nabo) => {
		let alt = dist.get(u) + avstand;
		if (alt < dist.get(nabo)) {
			dist.set(nabo, alt);
		}
	});
}

// Print resultatet
console.log(dist.get(slutthull));
console.timeEnd();

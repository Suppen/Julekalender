"use strict";

// Last instruksjonsfilen
const fs = require("fs");
let instruksjoner = fs.readFileSync("instruksjoner.txt", "utf-8");

// Start en timer
console.time();

// Parse instruksjonene
let tallRegexp = /(\d+),(\d+) through (\d+),(\d+)/;
let instruksjonRegexp = /^(turn (on|off)|toggle)/;
instruksjoner = instruksjoner.split("\r\n");

// Finn høyeste og laveste x- og y-verdi
let xMin = 9999;
let xMax = 0;
let yMin = 9999;
let yMax = 0;
instruksjoner.forEach(instruksjon => {
	let [_, x0, y0, x1, y1] = tallRegexp.exec(instruksjon);
	[x0, y0, x1, y1] = [Number.parseInt(x0), Number.parseInt(y0), Number.parseInt(x1), Number.parseInt(y1)]
	if (!(x1 < x0 || y1 < y0)) {
		if (x0 < xMin) xMin = x0;
		if (x1 < xMin) xMin = x1;
		if (x0 > xMax) xMax = x0;
		if (x1 > xMax) xMax = x1;
		if (y0 < yMin) yMin = y0;
		if (y1 < yMin) yMin = y1;
		if (y0 > yMax) yMax = y0;
		if (y1 > yMax) yMax = y1;
	}
});

// Lag griddet
let grid = new Array(yMax+1);
for (let y = 0; y < grid.length; y++) {
	grid[y] = new Array(xMax+1).fill(false);
}

// Definer funksjoner for å manipulere lysene
function utfor(handling, _, x0, y0, x1, y1) {
	x0 = Number.parseInt(x0);
	x1 = Number.parseInt(x1);
	y0 = Number.parseInt(y0);
	x1 = Number.parseInt(x1);
	for (let y = y0; y <= y1; y++) {
		for (let x = x0; x <= x1; x++) {
			handling(x, y);
		}
	}
}
function turnOn(x, y) {
	grid[y][x] = true;
}
function turnOff(x, y) {
	grid[y][x] = false;
}
function toggle(x, y) {
	grid[y][x] = !grid[y][x];
}

// Utfør instruksjonene
instruksjoner.forEach(instruksjon => {
	// Parse instruksjonen
	let koordinater = tallRegexp.exec(instruksjon);
	let handling = instruksjonRegexp.exec(instruksjon)[0];
	switch (handling) {
		case "turn on":
			handling = turnOn;
			break;
		case "turn off":
			handling = turnOff;
			break;
		case "toggle":
			handling = toggle;
			break;
		default:
			console.log("Eeeehhhhh.....");
			break;
	}
	utfor(handling, ...koordinater);
});

// Tell hvor mange som er på
let on = 0;
for (let y = yMin; y < grid.length; y++) {
	for (let x = xMin; x < grid[y].length; x++) {
		if (grid[y][x]) {
			on++;
		}
	}
}

// Print resultatet
console.log(on);
console.timeEnd();

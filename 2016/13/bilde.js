"use strict";

// Last instruksjonsfilen
const PNG = require("node-png").PNG;
const fs = require("fs");
let instruksjoner = fs.readFileSync("instruksjoner.txt", "utf-8");

// Definer sidelengder
let side = 10000;

// Lag griddet
let grid = new Array(side);
for (let i = 0; i < grid.length; i++) {
	grid[i] = new Array(side).fill(false);
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
let tallRegexp = /(\d+),(\d+) through (\d+),(\d+)/;
let instruksjonRegexp = /^(turn (on|off)|toggle)/;
instruksjoner.split("\r\n").forEach(instruksjon => {
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

// Konverter til bilde
let bildefil = fs.createWriteStream("bilde.pbm", "utf-8");

bildefil.write("P1\n");
bildefil.write(side + " " + side + "\n");
grid.forEach(rad => bildefil.write(rad.map(piksel => piksel ? "0" : "1").join(" ") + "\n"));
bildefil.end();

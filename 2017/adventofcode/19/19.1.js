"use strict";

/**************************
 * Import important stuff *
 **************************/

const fs = require("fs");

/************
 * Solve it *
 ************/

// Start a timer
console.time("Solved");

// Read and process the file
const map = fs.readFileSync("input.txt", "utf-8")
  .split("\n")
  .filter((line) => line !== "")	// Can't trim away the last line this time...
  .map((line) => line.split(""))

// Map of possible directions
const directions = {
	N: {dy: -1, dx: 0},
	S: {dy: 1, dx: 0},
	E: {dy: 0, dx: 1},
	W: {dy: 0, dx: -1}
};

// Find the start coord
let currentPos = {
	x: map[0].indexOf("|"),
	y: 0,
	direction: directions.S
};

// Start travelling
let endReached = false;
let letters = "";
while (!endReached) {
	const c = map[currentPos.y][currentPos.x];
	switch (c) {
		case "+":
			// Need to change direction
			if (currentPos.direction === directions.S || currentPos.direction === directions.N) {
				// Check E/W directions for the continuation of the path
				if (map[currentPos.y + directions.E.dy][currentPos.x + directions.E.dx] !== " ") {
					// Path is turning east
					currentPos.direction = directions.E;
				} else if (map[currentPos.y+ directions.E.dy][currentPos.x + directions.W.dx] !== " ") {
					// Path is turning west
					currentPos.direction = directions.W;
				}
			} else if ( currentPos.direction === directions.E || currentPos.direction === directions.W) {
				// Check N/S directions for the continuation of the path
				if (map[currentPos.y + directions.N.dy][currentPos.x + directions.N.dx] !== " ") {
					// Path is turning north
					currentPos.direction = directions.N;
				} else if (map[currentPos.y+ directions.S.dy][currentPos.x + directions.S.dx] !== " ") {
					// Path is turning south
					currentPos.direction = directions.S;
				}
			}
			// Intentionally no break in order to fall through and move
		default:
			// Check if it was a letter
			if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(c)) {
				letters += c;
			}

			// Keep travelling in the current direction
			currentPos.x += currentPos.direction.dx;
			currentPos.y += currentPos.direction.dy;
			break;
		case " ":
			endReached = true;
			break;
	}
}

// Solved!
console.timeEnd("Solved");
console.log(letters);

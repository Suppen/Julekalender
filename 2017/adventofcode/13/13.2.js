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

// Define some constants
const DOWN = 1;
const UP = -1;

// Read and process the file
const scanners = fs.readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split(": "))
  .map(([depth, range]) => [Number.parseInt(depth), Number.parseInt(range)])
  .reduce((scanners, [depth, range]) => {
	scanners.set(depth, (range-1)*2);
	return scanners;
  }, new Map());

// Keep track of the delay
let delay = -1;
let caught = false;

do {
	// Reset the caught flag
	caught = false;

	// Increase the delay
	delay++;

	// Calcylatethe scanners' position at the time the package reaces it with this delay
	const positions = [];
	for (const [depth, range] of scanners.entries()) {
		const position = (delay + depth) % range;
		if (position === 0) {
			caught = true;
			break;
		}
	}
} while (caught);

// Solved!
console.timeEnd("Solved");
console.log(delay);

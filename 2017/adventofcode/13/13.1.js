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
	scanners.set(depth, {
		range,
		direction: DOWN,
		position: 0
	});
	return scanners;
  }, new Map());

// Find the highest numbered scanner
let maxLayer = 0;
for (const layer of scanners.keys()) {
	maxLayer = Math.max(maxLayer, layer);
}

// Keep track of the severity
let severity = 0;

// Start moving
for (let i = 0; i <= maxLayer; i++) {
	// Get the scanner on this layer
	const scanner = scanners.get(i);
	if (scanner !== undefined) {
		// Check where the scanner is
		if (scanner.position === 0) {
			// Well fuck...
			severity += i * scanner.range;
		}
	}

	// Move all scanners
	for (const scanner of scanners.values()) {
		if (scanner.direction === UP && scanner.position === 0) {
			scanner.direction = DOWN;
		} else if (scanner.direction === DOWN && scanner.position === scanner.range-1) {
			scanner.direction = UP;
		}
		scanner.position += scanner.direction;
	}
}

// Solved!
console.timeEnd("Solved");
console.log(severity);

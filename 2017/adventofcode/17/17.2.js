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

// Read and parse the input
const steps = Number.parseInt(fs.readFileSync("input.txt", "utf-8"));

// The circular buffer the spinlock works on
const buffer = [0];

// Current position of the spinlock
let currentPos = 0;

for (let i = 1; i <= 50*10**6; i++) {
	// Move forward!
	currentPos = (currentPos + steps) % buffer.length;

	// Jam i in there
	buffer.splice(currentPos+1, 0, i);

	// i is the next position
	currentPos++;
}

// Find the number after 0
const zeroIndex = buffer.find((num) => num === 0);
console.log(zeroIndex);
const answer = buffer[(zeroIndex+1) % buffer.length];

// Solved!
console.timeEnd("Solved");
console.log(answer);

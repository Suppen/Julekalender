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

for (let i = 1; i <= 2017; i++) {
	// Move forward!
	currentPos = (currentPos + steps) % buffer.length;

	// Jam i in there
	buffer.splice(currentPos+1, 0, i);

	// i is the next position
	currentPos++;
}

// The target number is in the next cell
const answer = buffer[(currentPos+1) % buffer.length];

// Solved!
console.timeEnd("Solved");
console.log(answer);

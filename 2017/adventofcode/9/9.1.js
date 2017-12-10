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

// Read the input file
const input = fs.readFileSync("input.txt", "utf-8").trim();

// Keep track of the score
let score = 0;

// Process the input
let garbageBlock = false;
let currentDepth = 0;
for (let i = 0; i < input.length; i++) {
	// Get the character at position i
	const c = input.charAt(i);

	// Check what it is
	switch (c) {
		case "<":
			// Start of a block of garbage, or no meaning if it is already garbage
			garbageBlock = true;
			break;
		case ">":
			// End of a block of garbage
			garbageBlock = false;
			break;
		case "!":
			// Skip the next character
			i++;
			break;
		case "{":
			// Increase the depth if not inside garbage
			if (!garbageBlock) {
				currentDepth++;
			}
			break;
		case "}":
			// Closes a group, if not inside garbage
			if (!garbageBlock) {
				score += currentDepth--;
			}
			break;
		case ",":
			// Ignore
			break;
		default:
			// Probably garbage
			if (!garbageBlock) {
				throw new Error("Invalid character:", c.charCodeAt(0));
			}
	}
}

// Solved!
console.timeEnd("Solved");
console.log(score);

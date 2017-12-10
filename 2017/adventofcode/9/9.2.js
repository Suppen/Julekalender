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

// Keep track of the number of removed characters
let removed = 0;

// Process the input
let garbageBlock = false;
for (let i = 0; i < input.length; i++) {
	// Get the character at position i
	const c = input.charAt(i);

	// Check what it is
	switch (c) {
		case "<":
			// Start of a block of garbage, or garbage if inside a garbage block
			if (!garbageBlock) {
				garbageBlock = true;
			} else {
				removed++;
			}
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
			// Check if it is garbage
			if (garbageBlock) {
				removed++;
			}
			break;
		case "}":
			// Check if it is garbage
			if (garbageBlock) {
				removed++;
			}
			break;
		case ",":
			// Check if it is garbage
			if (garbageBlock) {
				removed++;
			}
			break;
		default:
			// Probably garbage
			if (!garbageBlock) {
				throw new Error("Invalid character: " + c);
			} else {
				removed++;
			}
	}
}

// Solved!
console.timeEnd("Solved");
console.log(removed);

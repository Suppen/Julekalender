"use strict";

// Shamelessly stolen and modified (and understood) from https://www.reddit.com/r/adventofcode/comments/7kc0xw/2017_day_17_solutions/drd90lo/ as my own solution takes far too long

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

// Calculate the number at position 1 after 50 million iterations
let pos = 0;
let first = 1;
for (let i = 1; i <= 50*10**6; i++) {
	pos = ((pos+steps % i) + 1) % i;
	if (pos === 0) {
		first = i;
	}
}

// Solved
console.timeEnd("Solved");
console.log(first);

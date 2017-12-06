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
const instructions = fs.readFileSync("input.txt", "utf-8")
  .split("\n")	// Split it into individual lines
  .filter((line) => line !== "")	// Remove the last, empty line
  .map((line) => Number.parseInt(line));	// Make sure the list consists of numbers

// Current instruction index
let i = 0;

// Number of steps taken
let n = 0;

// Do the instructions
while (i >= 0 && i < instructions.length) {
	i += instructions[i]++;
	n++;
}
  

// Solved!
console.timeEnd("Solved");
console.log(n);

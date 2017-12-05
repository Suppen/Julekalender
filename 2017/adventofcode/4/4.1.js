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
const solution = fs.readFileSync("input.txt", "utf-8")
  .split("\n")	// Split it into individual lines
  .filter((line) => line !== "")	// Remove the last, empty line
  .map((line) => line.split(" ").sort())	// Get the individual words in sorted order
  .filter((words) => {
	let isValid = true;
	for (let i = 0; i < words.length-1 && isValid; i++) {
		isValid = words[i] !== words[i+1];
	}
	return isValid;
  })
  .length;

// Solved!
console.timeEnd("Solved");
console.log(solution);

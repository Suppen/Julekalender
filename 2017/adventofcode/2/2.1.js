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

// Read the file
const solution = fs.readFileSync("input.txt", "utf-8")
  .split("\n")	// Split it into individual lines
  .filter((line) => line !== "")	// Get rid of the last line, which is empty
  .map((line) => line.split("\t").map((num) => Number.parseInt(num)))	// Split into cells and parse to numbers
  .map((line) => Math.max(...line) - Math.min(...line))	// Calculate the difference between the biggest and smallest number on each line
  .reduce((sum, difference) => sum + difference, 0);

console.timeEnd("Solved");
console.log(solution);

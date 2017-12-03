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
  .map((line) => line.reduce((result, num1, i, arr) => {
	// Check if the number has alrady been found
	if (result !== undefined) {
		return result;
	}

	// Check if this number evenly divides any other number in the array
	const num2 = arr.find((num2) => num1 % num2 === 0 && num1 !== num2);
	if (num2 !== undefined) {
		// It does. Return the result of the division
		return num1 / num2;
	}
  }, undefined))
  .reduce((sum, num) => sum + num);

console.timeEnd("Solved");
console.log(solution);

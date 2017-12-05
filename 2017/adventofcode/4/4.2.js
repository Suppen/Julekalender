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
  .map((line) => line
		  .split(" ")	// Split the line into individual words
	  	  .map((word) => word.split("").sort().join(""))	// Sort the characters in the words
	  	  .sort()	// Sort the words
  )
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

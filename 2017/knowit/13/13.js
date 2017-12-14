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

/**
 * Generator which spits out elements of the Thue-Morse sequence up to a given length
 *
 * @param {Integer} n	The number of elements to generate
 */
function* thueMorse(n) {
	// Store the string as it has currently been generated
	let currentString = "A";

	for (let i = 0; i < n; i++) {
		if (currentString.length <= i) {
			// Expand the string
			currentString += currentString.replace(/A/g, "C").replace(/B/g, "A").replace(/C/g, "B");
		}
		yield currentString.charAt(i);
	}
}

// Read and process the files
const prices = fs.readFileSync("loot.txt", "utf-8")
  .trim()	// Remove trailing newline
  .split("\n")	// Split into individual lines
  .map((line) => line.split(" ")[1])	// Care only about the price of the item
  .map((price) => Number.parseInt(price))	// Make sure the prices are numbers
  .sort((a, b) => a - b);	// Sort them from least to most expensive

let bobValue = 0;
for (const who of thueMorse(prices.length)) {
	const price = prices.pop();
	if (who === "B") {
		bobValue += price;
	}
}

// Solved!
console.timeEnd("Solved");
console.log(bobValue);

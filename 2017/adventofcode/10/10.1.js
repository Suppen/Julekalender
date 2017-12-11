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

// The list to hash
let list = new Array(256);
for (let i = 0; i < 256; i++) {
	list[i] = i;
}
// Wrap it in a proxy to be able to handle circularity
list = new Proxy(list, {
	get(target, property) {
		if (property >= target.length) {
			property = property % target.length;
		}
		return target[property];
	},
	set(target, property, newValue) {
		if (property >= target.length) {
			property = property % target.length;
		}
		target[property] = newValue;
		return true;
	}
});

// Current position to hash
let currentPosition = 0;

// Current skip size
let skipSize = 0;

// Read and parse the file
fs.readFileSync("input.txt", "utf-8")
  .trim()	// Remove trailing whitespace
  .split(",")	// Split the input on comma
  .map((num) => Number.parseInt(num))	// Make sure the elements are numbers
  .forEach((length) => {
	// Get a slice of the list. Can't use Array.prototype.slice because of the list's circularity
	let slice = new Array(length);
	for (let i = 0; i < length; i++) {
		slice[i] = list[i + currentPosition];
	}

	// Reverse it and put it back in the list
	slice.reverse()
	  .forEach((num, i) => list[i + currentPosition] = num);

	// Move the current position pointer and increase the skip size
	currentPosition += length + skipSize++;
  });

// Solved!
console.timeEnd("Solved");
console.log(list[0] * list[1]);

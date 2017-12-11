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
const lengths = fs.readFileSync("input.txt", "utf-8")
  .trim()	// Remove trailing whitespace
  .split("")	// Split it into individual characters
  .map((c) => c.charCodeAt(0))	// Get their ASCII value
  .concat([17, 31, 73, 47, 23]);	// Extend the list with the values given in the task

// Run the hash 64 times
for (let n = 0; n < 64; n++) {
	lengths.forEach((length) => {
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
}

// Calculate the dense hash
const denseHash = new Array(16);
for (let i = 0; i < list.length/16; i++) {
	// Calculate start and end indices
	const start = i*16;
	const end = start + 16;

	// Slice works fine now because we don't use the circularity
	denseHash[i] = list.slice(start, end).reduce((res, num) => res ^ num, 0);
}

// Get the hex representation of the hash
const hex = denseHash.map((num) => num.toString(16).padStart(2, "0")).join("");

// Solved!
console.timeEnd("Solved");
console.log(hex);

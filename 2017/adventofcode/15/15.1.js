"use strict";

// Start a timer
console.time("Solved");

// The input file is in a slightly silly format, so I just define the start values in the code
const aStartValue = 873;
const bStartValue = 583;

// Factors to use for the generators
const aFactor = 16807;
const bFactor = 48271;

// Number of times to run the generators
const n = 40 * 10**6;

/**
 * Duelling generator
 *
 * @param {Integer} startValue	The start value of the generator
 * @param {Integer} factor	The factor to use
 *
 * @returns {Integer}	Some kind of number
 */
function* dg(startValue, factor) {
	// Handle for the previously generated value
	let previousValue = startValue;

	// Generate the next value forever
	while (true) {
		// Calculate the new value and return it
		const newValue = previousValue * factor % (2**31 - 1);
		yield newValue;

		// The new values is now the previous value
		previousValue = newValue;
	}
}

// Create the generator instances
const a = dg(aStartValue, aFactor);
const b = dg(bStartValue, bFactor);

// Keep track of how many times the lower 16 bits of the generated numbers match
let matches = 0;

// Run them 40 million times
for (let i = 0; i < n; i++) {
	// Get the numbers from the generators
	const aNum = a.next().value;
	const bNum = b.next().value;

	// Compare the lower 16 bits of the numbers
	if ((aNum & 0xFFFF) === (bNum & 0xFFFF)) {
		matches++;
	}
}

// Solved!
console.timeEnd("Solved");
console.log(matches);

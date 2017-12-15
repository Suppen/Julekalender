"use strict";

// Start a timer
console.time("Solved");

/**
 * Calculates the nth tribonacci number
 *
 * @param {Integer} n	Index of the tribonacci number to find
 *
 * @returns {Integer}	The nth tribonacci number
 */
function tribonacci(n) {
	let a = 0;
	let b = 0;
	let c = 1;
	for (let k = 0; k < n; k++) {
		let d = a+b+c;
		a = b;
		b = c;
		c = d;
	}
	return c;
}

// Calculate the 30th tribonacci number
const solution = tribonacci(30);

// Solved!
console.timeEnd("Solved");
console.log(solution);

"use strict";

// Start a timer
console.time("Solved");

/**
 * Counts number of ways to write a number as a sum of consecutive integers. Found on http://www.geeksforgeeks.org/count-ways-express-number-sum-consecutive-numbers/
 *
 * @param {Integer} n	The number to check
 *
 * @returns {Integer}	Number of ways to write the input as a sum of consecutive integers
 */
function countConsecutive(n) {
	let count = 0;
	for (let l = 1; l * (l + 1) < 2 * n; l++) {
		const a = (1.0 * n-(l * (l + 1)) / 2) / (l + 1);
		if (a - Math.floor(a) === 0.0) {
			count++;
		}
	}
	return count;
}

// Keep track of the sum
let sum = 0;

// Check all numbers in the task
for (let i = 1; i <= 130000; i++) {
	sum += countConsecutive(i);
}

// Solved!
console.timeEnd("Solved");
console.log(sum);

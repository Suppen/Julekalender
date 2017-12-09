"use strict";

// Start a timer
console.time("Solved");

// Allocate an array for all numbers up to 10**7
const numbers = new Array((10**7) + 1).fill(0);

// The first number is a christmas number
numbers[1] = 1;

// Number 89 is NOT a christmas number
numbers[89] = 89;

// Make the squares of the numbers 0-9, to avoid having to recalculate them all the time
const squaredDigits = new Array(10).fill(0).map((a, i) => i**2);

/**
 * Finds the sum of the square of the digits in a number
 *
 * @param {Integer} num	The number to process
 *
 * @returns {Integer}	The sum of the squares of the digits in the input
 */
function next(num) {
	return String(num)
	  .split("")
	  .map((digit) => squaredDigits[Number.parseInt(digit)])
	  .reduce((sum, num) => sum + num, 0);
}

// Check all numbers below 10**7
for (let i = 2; i < numbers.length; i++) {
	// Check what number the sequence starting with this ends with
	let k = i;
	while (numbers[k] === 0) {
		k = next(k);
	}

	// Mark the place in the array
	numbers[i] = numbers[k];
}

// Calculate the sum of the numbers whose sequence ends with 1
const sumOfChristmasNumbers = numbers.reduce((sum, num, i) => num === 1 ? sum + i : sum, 0);

// Solved!
console.timeEnd("Solved");
console.log(sumOfChristmasNumbers);

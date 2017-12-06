"use strict";

// Start a timer
console.time("Solved");

// Find the first n elements in the list
const n = 1000000;

// Create storage for the elements. It is quicker to allocate the whole array now than to allocate pieces when needed
const a = new Array(n+1);

// a(1) = 1
a[1] = 1;

// a(2) must be 2 in order to not break any constraints
a[2] = 2;

// Keep track of the sum
let sum = 3;

// Keep track of which number is currently being worked with, and how many times it ha been used
let currentNum = 2;
let instancesOfCurrentNum = 1;

// Make the rest of the list
for (let i = 3; i <= n; i++) {
	if (instancesOfCurrentNum < a[currentNum]) {
		// Need more of this number
		a[i] = currentNum;
		instancesOfCurrentNum++;
		sum += currentNum;
	} else {
		// We have enough of this number. Go on to the next
		currentNum++;
		instancesOfCurrentNum = 0;

		// Reduce counter by one to redo this iteration
		i--;
	}
}

// Solved!
console.timeEnd("Solved");
console.log(sum);

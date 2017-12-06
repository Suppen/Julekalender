"use strict";

// Start a timer
console.time("Solved");

// Find the first n elements in the list
const n = 1000000;

// Create storage for the elements
let a = [0, 1, 2, 2];

// Keep track of which number is currently being worked with
let currentNum = 3;

// Make the list
while (a.length <= n) {
	a = a.concat(new Array(a[currentNum]).fill(currentNum++));
}

// Sum the elements
const solution = a.slice(1, n+1).reduce((sum, num) => sum + num);

// Solved!
console.timeEnd("Solved");
console.log(solution);

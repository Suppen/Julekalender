"use strict";

// Start a timer
console.time("Solved");

// Number of verses
const n = 1024;

// Count gifts
let count = 0;
for (let i = 1; i <= n; i++) {
	count += i*(i+1)/2;
}

// Solved!
console.timeEnd("Solved");
console.log(count);

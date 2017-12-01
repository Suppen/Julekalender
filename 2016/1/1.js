"use strict";

console.time();
let i = 6;
let currentPow = 1;
let j;
let p = Math.pow(10, currentPow);
do {
	if (i > p) {
		currentPow++;
		p = Math.pow(10, currentPow);
	}
	j = i + p;
	i += 10;
} while ((6 * p + (j-6)/10) / j !== 4);
console.log(j);
console.timeEnd();

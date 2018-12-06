"use strict";

console.time("Solved");

function isZeroHeavy(n) {
	return [...n.toString()].reduce((balance, c) => c === '0' ? balance+1 : balance-1, 0) > 0;
}

let sum = 0;

for (let i = 0; i <= 18163106; i++) {
	if (isZeroHeavy(i)) {
		sum += i;
	}
}

console.timeEnd("Solved");

console.log(sum);

"use strict";

console.time()
let a = 0, b = 1, c = 1;

let sum = 0;

while (c < 4000000000) {
	a = b;
	b = c;
	c = a+b;
	if (c % 2 === 0) {
		sum += c;
	}
}
console.log(sum-c);
console.timeEnd();

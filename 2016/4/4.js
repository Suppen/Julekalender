"use strict";

console.time();

let numbers = [0];
let end = 1337;
   
let i; 
do {
	for (i = 0; i < numbers.length; i++) {
		numbers[i]++;
		if (numbers[i] % 7 === 0 || (numbers[i] + "").includes("7")) {
			if (i === numbers.length - 1) {
				numbers.push(0);
			}
		} else {
			break;
		}
	}
} while (numbers[0] < end);

console.log(numbers[i]);
console.timeEnd();

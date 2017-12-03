"use strict"

/**************************
 * Import important stuff *
 **************************/

const fs = require("fs");

/************
 * Solve it *
 ************/

// Read the file
const captcha = fs.readFileSync("input.txt", "utf-8");

// Split it into single digits
const digits = captcha.replace(/[^0-9]/g, "").split("").map((digit) => Number.parseInt(digit));

// Copy the first digit to the end to simulate circularity
digits.push(digits[0]);

// Sum them
let sum = 0;
for (let i = 0; i < digits.length-1; i++) {
	if (digits[i] === digits[i+1]) {
		sum += digits[i];
	}
}

console.log(sum);

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

// Sum them
let sum = 0;
for (let i = 0; i < digits.length; i++) {
	const halfwayAroundIndex = (i + digits.length / 2) % digits.length;
	if (digits[i] === digits[halfwayAroundIndex]) {
		sum += digits[i];
	}
}

console.log(sum);

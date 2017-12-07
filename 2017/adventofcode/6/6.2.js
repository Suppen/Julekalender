"use strict";

/**************************
 * Import important stuff *
 **************************/

// XXX WARNING: Butt ugly code is butt ugly!

const fs = require("fs");

/************
 * Solve it *
 ************/

// Start a timer
console.time("Solved");

// Read and process the file
const initialBanks = fs.readFileSync("input.txt", "utf-8")
  .trim()	// Remove rogue newline at the end
  .split("\t")	// Split it into individual lines
  .map((num) => Number.parseInt(num))	// Turn them into numbers

// List of already seen banks
const banks = [initialBanks];

// Function to check if a bank has already been seen
function seenBefore(theseBanks) {
	let seenBefore = true;
	return banks.some((seenBanks) => {
		let same = true;
		for (let i = 0; i < theseBanks.length; i++) {
			same = same && theseBanks[i] === seenBanks[i];
		}
		return same;
	});
}

// Hacky function to clone an array
function cloneArray(arr) {
	return arr.map((e) => e);
}

let n = 0;
let currentBanks = initialBanks;
do {
	n++;

	// Find bank with most stuff
	let i = currentBanks.findIndex((bank, i, arr) => bank === Math.max(...arr));

	banks.push(currentBanks);
	currentBanks = cloneArray(currentBanks);
	let c = currentBanks[i];
	currentBanks[i] = 0;
	while (c > 0) {
		i = (i+1) % currentBanks.length;
		currentBanks[i]++;
		c--;
	}
} while (!seenBefore(currentBanks));
banks.push(currentBanks);

const i = banks.findIndex((bank) => {
	let isSame = true;
	for (let i = 0; i < bank.length; i++) {
		isSame = isSame && bank[i] === banks[banks.length-1][i];
	}
	return isSame;
});

console.timeEnd("Solved");
console.log(banks.length - i);

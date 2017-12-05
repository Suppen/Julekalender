"use strict";

/**************************
 * Import important stuff *
 **************************/

const fs = require("fs");

/************
 * Solve it *
 ************/

// Start a timer
console.time("Solved");

// Read and process the file
const solution = fs.readFileSync("wordlist.txt", "utf-8")
  .split("\r\n")	// Split into individual lines
  .filter((word) => word !== "")	// Remove the last empty line
  .filter((word) => {	// Remove palindromes
	// This is more efficient than reversing the string and checking for equality
	let isPalindrome = true;
	for (let i = 0; i < word.length/2 && isPalindrome; i++) {
		isPalindrome = word[i] === word[word.length-i-1];
	}
	return !isPalindrome;
  })
  .map((word) => word.split("").reduce((charCount, c) => {	// Count occurences of each character
	if (charCount[c] === undefined) {
		charCount[c] = 0;
	}
	charCount[c]++;
	return charCount;
  }, {}))
  .filter((wordObj) => {	// Filter out words with more than one characher occuring an odd number of times
	let singleChars = 0;
	for (let c in wordObj) {
		if (wordObj[c] % 2 !== 0) {
			singleChars++;
		}
	}
	return singleChars < 2;
  })
  .length;

// Solved!
console.timeEnd("Solved");
console.log(solution);

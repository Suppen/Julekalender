"use strict";

/**************************
 * Import important stuff *
 **************************/

const fs = require("fs");
const util = require("util");
const path = require("path");
const readFileAsync = util.promisify(fs.readFile);

/****************
 * Get the word *
 ****************/

const word = "aeteesasrsssstaesersrrsse";

/************
 * Solve it *
 ************/

// Time it
console.time("Solved");

// Start reading the file
const filePromise = readFileAsync(path.join(__dirname, "wordlist.txt"), "utf-8");

/**
 * Makes an n-gram of a word
 *
 * @param {Integer} n	Which n-order to use
 * @param {String} word	The word to make the n-gram of
 *
 * @returns {String}	The n-gram of the word
 */
function makeNGram(n, word) {
	// Handle for the parts
	const res = [];

	// Slide a window across the word
	for (let i = 0; i < word.length - n + 1; i++) {
		res.push(word.substr(i, n));
	}

	// Join them to a string and return them
	return res.join("");
}

/**
 * Checks if a pair of n (of the n-gram) and l (length of the solution string) will create a n-gram-string of length L
 *
 * @param {Integer} n	n of the n-gram
 * @param {Integer} l	Length of the solution string
 * @param {Integer} L	Length of the n-gram of the solution string
 *
 * @returns {Boolean}	True if the numbers are correct, false otherwise
 */
function checkNL(n, l, L) {
	return n * (l - n + 1) === L;
}

// Sort the word
const sortedWord = word.split("").sort().join("");

// Find out which letters are in it
const letters = [];
sortedWord.split("").forEach((letter) => {
	if (!letters.includes(letter)) {
		letters.push(letter);
	}
});

// Make a regexp to filter the lines on. Take only lines which contain only these letters
const filterRegexp = new RegExp(`^[${letters.join("")}]*$`);

// Figure out the length of the original string (l) and which n-gram this is
const possibleValues = [];
for (let l = 1; l < word.length; l++) {
	for (let n = 1; n <= l; n++) {
		if (checkNL(n, l, word.length)) {
			possibleValues.push({n, l});
		}
	}
}
const {n, l} = possibleValues[0];

// Process the file once it is finished
filePromise.then((file) => {
	const solution = file.split("\r\n")
	  .filter((line) => line.length === l && filterRegexp.test(line))	// Only take strings of the found length
	  .filter((line) => filterRegexp.test(line))	// Only take lines which have the same characters as the word
	  .find((line) => {
		// Check if the line's sorted n-gram equals the sorted version of the word
		const sortedNGram = makeNGram(n, line).split("").sort().join("");
		return sortedNGram === sortedWord;
	  });

	// Solution found
	console.timeEnd("Solved");
	console.log(`Solution: ${n}-${solution}`);
});

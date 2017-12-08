"use strict";

// Start a timer
console.time("Solved");

// The keyword to find the meaning of
const keyword = "OTUJNMQTYOQOVVNEOXQVAOXJEYA";

// The alphabet to use
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Mapping between letters and their rot value
const mapping = {};

// Fill the mapping
alphabet.split("").forEach((letter, i) => {
	// Find the charcode of this letter
	const charcode = letter.charCodeAt(0);

	// Find the rotation value of the letter
	const rotVal = (charcode + i + 1) % alphabet.length;

	// Find out which letter this maps to
	let newCharcode = charcode + rotVal;

	// Check if it is past the end of the alphabet, and adjust accordingly
	if (newCharcode > alphabet.charCodeAt(alphabet.length-1)) {
		newCharcode = newCharcode - alphabet.length;
	}

	// Find the letter this maps to
	const newLetter = String.fromCharCode(newCharcode);

	// Put it in the map
	mapping[newLetter] = letter;
});
console.log(mapping);

// Decrypt the word
const solution = keyword
  .split("")
  .map((letter) => mapping[letter])
  .join("");

// Solved!
console.timeEnd("Solved");
console.log(solution);

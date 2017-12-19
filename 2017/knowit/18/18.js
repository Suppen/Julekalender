"use strict";

// XXX Not completed because of terrible and very ambiguous explanation in the task. The answer is apparently 'Akebrett til Baldur!'

/**************************
 * Import important stuff *
 **************************/

const fs = require("fs");

/************
 * Solve it *
 ************/

// Start a timer
console.time("Solved");

// The Icelandic alphabet
const alphabet = "AÁBDÐEÉFGHIÍJKLMNOÓPRSTUÚVXYÝÞÆÖ";

// The ciphertext
const cipher = "1110010101000001011000000011101110100101010011011010101101100000010001111101000001010010001011101001100100100011010000110101111101010011100010110001100111110010";

/*******************
 * Prepare the key *
 *******************/

// Read the key file
const key = fs.readFileSync("text.txt", "utf-8")
  // Remove all characters not in the icelandic alphabet
  .replace(new RegExp("[^" + alphabet + "]", "g"), "")
  // Split into individual characters
  .split("")
  // Count the occurences 
  .reduce((count, c) => {
	// Find the count object for this character
	let obj = count.find((obj) => obj.c === c);
	if (obj === undefined) {
		// None exists. Create one and put it on the count array
		obj = {
			c,
			count: 0
		};
		count.push(obj);
	}
	// Count this instance of the character
	obj.count++;
	return count;
  }, [])
  // Sort them by occurences
  .sort((a, b) => b.count - a.count)
  // Get just the character
  .map(({c}) => c);

/**********************
 * Prepare the cipher *
 **********************/

// Split it into chunks of 5 bits
const preparedCipher = [];
for (let i = 0; i < cipher.length; i += 8) {
	// Get the 5 next bits
	const bits = cipher.slice(i, i+8);

	// Turn them into a number
	const num = Number.parseInt(bits, 2);

	// Shove it on the array
	preparedCipher.push(num);
}

console.log(preparedCipher.map((num, i) => num ^ key[i]).map((num) => String.fromCharCode(num)));

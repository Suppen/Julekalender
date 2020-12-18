"use strict";

const fs = require("fs");

const isPalindrome = word => {
	const l = word.length;
	const half = Math.floor(l / 2);
	for (let i = 0; i < half; i++) {
		if (word[i] !== word[l - i - 1]) {
			return false;
		}
	}
	return true;
}

const isAlmostPalindrome = word => {
	if (word.length < 3) {
		return false;
	}

	if (isPalindrome(word)) {
		return false;
	}

	const l = word.length;
	const half = Math.floor(l / 2);
	let i = 0;
	while (i < half) {
		if (word[i] === word[l-i-1]) {
			i++;
		} else if (word[i] === word[l-i-2] && word[i+1] === word[l-i-1]) {
			i += 2;
		} else {
			return false;
		}
	}

	return true;
};

const almostPalindromes =
	fs
		.readFileSync("wordlist.txt", "utf-8")
		.split("\n")
	//["gnisning", "kauka", "baluba", "tarotkorta"]
		.filter(isAlmostPalindrome)
		.length;

console.log(almostPalindromes);

module.exports = {
	isAlmostPalindrome,
	isPalindrome
};

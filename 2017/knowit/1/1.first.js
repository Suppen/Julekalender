"use strict";

const fs = require("fs");

console.time("Solved");
const sortedWord = [..."aeteesasrsssstaesersrrsse"].sort().join("");

function makeSortedNGrams(word) {
	const maxN = word.length;

	const results = new Array(maxN).fill(0);
	for (let n = 1; n < maxN; n++) {
		results[n] = makeNGram(n, word).join("").split("").sort().join("");
	}

	return results;
}

function makeNGram(n, word) {
	const res = [];

	for (let i = 0; i < word.length - n + 1; i++) {
				res.push(word.substr(i, n));
			}

	return res;
}

const result = fs.readFileSync("wordlist.txt", "utf-8")
  .split("\r\n")
  .filter((w) => /^[aerst]*$/.test(w))
  .find((w) => makeSortedNGrams(w).includes(sortedWord));

const n = makeSortedNGrams(result).findIndex((w) => w === sortedWord);

console.log(n + "-" + result);
console.timeEnd("Solved");

"use strict";

const fs = require("fs");
const R = require("ramda");

const matrix = fs
	.readFileSync("matrix.txt", "utf-8")
	.split("\n")
	.filter(line => line !== "")
	.map(line => line.split(""));
const words = fs
	.readFileSync("wordlist.txt", "utf-8")
	.split("\n")
	.filter(line => line !== "");

// The 8 directions one can move in a matrix
const directions = [
	[1,0],
	[1,1],
	[0,1],
	[0,-1],
	[-1,-1],
	[-1,0],
	[1,-1],
	[-1,1]
];

// Checks whether or not a coordinate is inside a matrix
const isInside = (matrix, x, y) => matrix[y] !== undefined && matrix[y][x] !== undefined;

// Transposes a matrix
const transpose = matrix => {
	const transposed = [];
	for (let y = 0; y < matrix.length; y++) {
		transposed[y] = [];
		for (let x = 0; x < matrix.length; x++) {
			transposed[x][y] = matrix[y][x];
		}
	}
	return transposed;
}

const getDeltaCoordsForWord = word =>
	R.transpose(
		[...word].map((_letter, i) => directions
			.map(([dx, dy]) => [i*dx, i*dy])
		)
	);

// Checks whether or not a matrix contains a word
const contains = (matrix, word) => {
	const deltas = getDeltaCoordsForWord(word);

	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			const matrixWords = deltas
				.map(ds => ds.map(([dx, dy]) => [x+dx, y+dy]))
				.map(ds => ds.filter(([dx, dy]) => isInside(matrix, dx, dy)))
				.map(ds => ds.map(([dx, dy]) => matrix[dy][dx]))
				.flatMap(a => a.join(""));

			if (matrixWords.includes(word)) {
				return true;
			}
		}
	}

	return false;
}

console.log(words.filter(word => !contains(matrix, word)).sort().join(","));

module.exports = { contains, getDeltaCoordsForWord };

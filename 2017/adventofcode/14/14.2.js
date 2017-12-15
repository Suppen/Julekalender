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

// Read the input
const input = fs.readFileSync("input.txt", "utf-8").trim();

/**
 * Knot hash function. Mostly copied from day 10
 *
 * @param {String} input	The input to use
 *
 * @returns {String}	The binary representation of the hash
 */
function knotHash(input) {
	// The list to hash
	let list = new Array(256);
	for (let i = 0; i < 256; i++) {
		list[i] = i;
	}
	// Wrap it in a proxy to be able to handle circularity
	list = new Proxy(list, {
		get(target, property) {
			if (property >= target.length) {
				property = property % target.length;
			}
			return target[property];
		},
		set(target, property, newValue) {
			if (property >= target.length) {
				property = property % target.length;
			}
			target[property] = newValue;
			return true;
		}
	});

	// Current position to hash
	let currentPosition = 0;

	// Current skip size
	let skipSize = 0;

	// Read and parse the file
	const lengths = input
	  .trim()	// Remove trailing whitespace
	  .split("")	// Split it into individual characters
	  .map((c) => c.charCodeAt(0))	// Get their ASCII value
	  .concat([17, 31, 73, 47, 23]);	// Extend the list with the values given in the task

	// Run the hash 64 times
	for (let n = 0; n < 64; n++) {
		lengths.forEach((length) => {
			// Get a slice of the list. Can't use Array.prototype.slice because of the list's circularity
			let slice = new Array(length);
			for (let i = 0; i < length; i++) {
				slice[i] = list[i + currentPosition];
			}

			// Reverse it and put it back in the list
			slice.reverse()
			  .forEach((num, i) => list[i + currentPosition] = num);

			// Move the current position pointer and increase the skip size
			currentPosition += length + skipSize++;
		});
	}

	// Calculate the dense hash
	const denseHash = new Array(16);
	for (let i = 0; i < list.length/16; i++) {
		// Calculate start and end indices
		const start = i*16;
		const end = start + 16;

		// Slice works fine now because we don't use the circularity
		denseHash[i] = list.slice(start, end).reduce((res, num) => res ^ num, 0);
	}

	// Return the binary representation of the hash
	return denseHash.map((num) => num.toString(2).padStart(8, "0")).join("");
}

// Make the grid
const grid = [];
for (let y = 0; y < 128; y++) {
	// Make the hash
	grid[y] = knotHash(input + "-" + y).replace(/1/g, "#").replace(/0/g, " ").split("");
}

// Deltas for neighbour cells
const deltas = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1]
];

/**
 * Eliminates a group of used space using a flood fill like algorithm
 *
 * @param {Integer} x	X coordinate of the current cell to elminiate
 * @param {Integer} y	Y coordinate of the current cell to elminiate
 * @param {String[][]} grid	The grid to eliminate the group from
 */
function eliminateGroup(x, y, grid, groupNumber) {
	// Eliminate this cell
	grid[y][x] = "*";

	// Find and eliminate used neighbours
	return deltas
	  .map(([dy, dx]) => [y + dy, x + dx])
	  .filter(([y, x]) => (
		x >= 0 &&
		y >= 0 &&
		x < grid.length &&
		y < grid.length &&
		grid[y][x] === "#"
	  ))
	  .forEach(([y, x]) => eliminateGroup(x, y, grid));
}

// Find and eliminate groups of used cells
let x = 0;
let y = 0;
let groups = 0;
while (y < grid.length) {
	// Find the next used cell
	if (grid[y][x] === "#") {
		// Eliminate this group!
		eliminateGroup(x, y, grid);
		groups++;
	}

	// Increast the coordinates
	x++;
	if (x > grid[y].length) {
		x = 0;
		y++;
	}
}

// Solved!
console.timeEnd("Solved");
console.log(groups);

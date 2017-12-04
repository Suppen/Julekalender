"use strict";

/**************************
 * Import important stuff *
 **************************/

const fs = require("fs");

/************
 * Solve it *
 ************/

// Read the target number from file
const num = Number.parseInt(fs.readFileSync("input.txt", "utf-8"));

// Hold the ulam spiral somewhere
const ulam = new Proxy({}, {
	get(target, property) {
		if (!(property in target)) {
			target[property] = new Proxy({}, {
				get(target, property) {
					if (!(property in target)) {
						target[property] = 0;
					}
					return target[property];
				}
			});
		}
		return target[property];
	}
});

// Initialize the center to 1
ulam[0][0] = 1;

function getAdjacentNumbers(x, y) {
	const adjacentNumbers = [];
	for (let dy = -1; dy <= 1; dy++) {
		for (let dx = -1; dx <= 1; dx++) {
			if (!(dx === 0 && dy === 0)) {
				adjacentNumbers.push(ulam[y+dy][x+dx]);
			}
		}
	}
	return adjacentNumbers;
}

// Keep track of how big the spiral has become
let maxX = 0;
let minX = 0;
let maxY = 0;
let minY = 0;

// Current coordinates in the spiral
let x = 0;
let y = 0;

// The direction we are heading
let direction = {x: 1, y: 0};

// Traverse the spiral
let i = 1;
while (ulam[y][x] < num) {
	i++;
	if (direction.x !== 0) {
		if (direction.x === 1) {
			x++;
			if (x > maxX) {
				maxX = x;
				direction = {x: 0, y: 1};
			}
		} else if (direction.x === -1) {
			x--;
			if (x < minX) {
				minX = x;
				direction = {x: 0, y: -1};
			}
		}
	} else if (direction.y !== 0) {
		if (direction.y === 1) {
			y++;
			if (y > maxY) {
				maxY = y;
				direction = {x: -1, y: 0};
			}
		} else if (direction.y === -1) {
			y--;
			if (y < minY) {
				minY = y;
				direction = {x: 1, y: 0};
			}
		}
	}
	ulam[y][x] = getAdjacentNumbers(x, y).reduce((sum, num) => sum + num, 0);
}

console.log(ulam[y][x]);

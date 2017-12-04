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

// Keep track of how big the spiral has become
let maxX = 0;
let minX = 0;
let maxY = 0;
let minY = 0;

// Current coordinates in the spiral
let x = -1;
let y = 0;

// The direction we are heading
let direction = {x: 1, y: 0};

// Traverse the spiral
for (let i = 1; i <= num; i++) {
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
}

// We now have x and y coordinates of the target number. Sum their absolutes to get the taxicab distance to the center
console.log(Math.abs(x) + Math.abs(y));

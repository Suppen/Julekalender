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

// The field to walk in
const field = new Proxy({
	minX: 0,
	maxX: 0,
	minY: 0,
	maxY: 0
}, {
	get(target, property) {
		// Auto-create the x-axis on-demand
		if (!(property in target)) {
			target[property] = new Proxy({}, {
				set(target2, property2, value) {
					// Update the min and max X
					const ew = Number.parseInt(property2);
					target.minX = Math.min(target.minX, ew);
					target.maxX = Math.max(target.maxX, ew);

					// Update the value
					target2[property2] = value;

					return true;
				}
			});

			// Update the min and max Y
			const ns = Number.parseInt(property);
			target.minY = Math.min(target.minY, ns);
			target.maxY = Math.max(target.maxY, ns);
		}
		return target[property];
	}
});

// Possible directions to walk
const directions = {
	east: [1, 0],
	west: [-1, 0],
	north: [0, 1],
	south: [0, -1]
};

/**
 * Walks a number of steps in a given direction from a starting location on a field
 *
 * @param {Integer[]} startPos	Array of coordinates to start from
 * @oaram {Integer} startPos.0	Y coordinate to start from
 * @param {Integer} startPos.1	X coordinate to start from
 * @param {Object} field	The field to walk in
 * @param {Integer} steps	Number of steps to take
 * @param {Integer[]} direction	Array of deltas to take each step
 * @param {Integer} direction.0	Y-delta to walk each step
 * @param {Integer} direction.1	X-delta to walk each step
 *
 * @returns {Integer[]}	The position the walker ends up in
 */
function walk([y, x], field, steps, [dy, dx]) {
	for (let i = 0; i < steps; i++) {
		field[y+dy*i][x+dx*i] = true;
	}
	return [y + dy*steps, x + dx*steps];
}

// Read and process the file
fs.readFileSync("path.txt", "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split(", "))
  .map(([steps, direction]) => ({
	steps: Number.parseInt(steps),
	direction: directions[direction]
  }))
  .reduce((currentPos, {steps, direction}) => {
	return walk(currentPos, field, steps, direction);
  }, [0, 0]);

// Draw the field
const drawing = [];
for (let x = field.maxX; x >= field.minX; x--) {
	const row = [];
	for (let y = field.minY; y <= field.maxY; y++) {
		if (field[y][x] === true) {
			row.push("#");
		} else {
			row.push(" ");
		}
	}
	drawing.push(row.join(""));
}

// Solved!
console.timeEnd("Solved");
console.log(drawing.join("\n"));

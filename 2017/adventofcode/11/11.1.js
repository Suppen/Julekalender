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

// Hex Coordinates of the current cell
let x = 0;
let y = 0;
let z = 0;

// Read and process the file
fs.readFileSync("input.txt", "utf-8")
  .trim()
  .split(",")
  .forEach((direction) => {
	switch (direction) {
		case "n":
			y++;
			z--;
			break;
		case "s":
			y--;
			z++;
			break;
		case "ne":
			x++;
			z--;
			break;
		case "sw":
			x--;
			z++;
			break;
		case "nw":
			x--;
			y++;
			break;
		case "se":
			x++;
			y--;
			break;
	}
  });

// The solution is the absolute value of the lowest value
const solution = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));

// Solved!
console.timeEnd("Solved");
console.log(solution);

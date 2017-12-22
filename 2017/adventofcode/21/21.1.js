"use strict";

//XXX Didn't bother to finish this

/**************************
 * Import important stuff *
 **************************/

const fs = require("fs");

/************
 * Solve it *
 ************/

// Start a timer
console.time("Solved");

// The initial picture
const initialImage =
`.#.
..#
###`;

// Read the patterns
const patterns = fs.readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.replace(/\//g, "\n"))
  .map((line) => line.split(" => "))
  .map((i[from, to]) => ({from, to}));

let image = initialImage;
for (let i = 0; i < 5; i++) {
	// Divide the image. Its sides are equal to the position of the first newline
	const divisor = image.indexOf("\n") % 2 === 0 ? 2 : 3;

	const subimages = [];

}

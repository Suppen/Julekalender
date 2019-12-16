"use strict";

const fs = require("fs");
const R = require("ramda");

const WEST = "w";
const EAST = "e";

R.compose(
	console.log.bind(console),
	// Take the answer
	R.nth(2),
	// Start crossing
	({ x, fjord }) =>
		R.reduce(([x, dir, crossings], row) => {
			R.compose(
				console.log.bind(console),
				R.join(""),
				R.update(x, dir === WEST ? "/" : "\\"),
				R.split("")
			)(row);

			if (dir === WEST && row[x - 3] !== " ") {
				crossings++;
				dir = EAST;
			} else if (dir === EAST && row[x + 3] !== " ") {
				crossings++;
				dir = WEST;
			} else if (dir === WEST) {
				x--;
			} else if (dir === EAST) {
				x++;
			}

			return [x, dir, crossings];
		}, [x, WEST, 1])(fjord),
	// Initialize it
	fjord => {
		// Transpose the fjord for easier reduction
		const transposedFjord = R.compose(
			R.map(R.join("")),
			R.transpose
		)(fjord);

		// Find the start position
		const y = R.findIndex(R.includes("B"), transposedFjord);
		const x = R.findIndex(R.equals("B"), transposedFjord[y]);

		// Drop rows before the boat
		const modifiedFjord = R.drop(y, transposedFjord);

		return { x, fjord: modifiedFjord };
	},
	// Parse the file
	R.split("\n"),
	R.trim
)(fs.readFileSync("input.txt", "utf-8"));

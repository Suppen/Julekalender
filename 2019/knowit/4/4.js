"use strict";

const fs = require("fs");
const R = require("ramda");

const DESERT_WIDTH = 1000;
const DESERT_HEIGHT = 1000;

function* range(from, to) {
	const sign = Math.sign(to - from);

	while (from !== to) {
		yield from;
		from += sign;
	}
}

const traverse = R.curry((desert, coords) => {
	// Start at (0, 0) and slime it
	let currentPos = [0, 0];
	desert[currentPos[1]][currentPos[0]]++;

	let time = 0;
	for (const [nextX, nextY] of coords) {

		const xSign = Math.sign(nextX - currentPos[0]);
		const ySign = Math.sign(nextY - currentPos[1]);

		// Move horizontally to the next X coordinate
		for (const x of range(currentPos[0] + xSign, nextX + xSign)) {
			currentPos = [x, currentPos[1]];
			time += desert[currentPos[1]][currentPos[0]]++;
		}
		// Move vertically to the next Y coordinate
		for (const y of range(currentPos[1] + ySign, nextY + ySign)) {
			currentPos = [currentPos[0], y];
			time += desert[currentPos[1]][currentPos[0]]++;
		}
	}


	return time;
});

R.compose(
	console.log.bind(console),
	// Traverse the desert
	traverse(
		R.map(() => new Array(DESERT_WIDTH).fill(1), new Array(DESERT_HEIGHT))
	),
	// Convert each line to coordinates
	R.map(([x, y]) => [Number.parseInt(x), Number.parseInt(y)]),
	R.map(R.split(",")),
	// Ignore the header and empty lines
	R.filter(l => l.length !== 0),
	R.tail,
	// Split into lines
	R.split("\n")
)(fs.readFileSync("./input.txt", "utf-8"));
//)("x,y\n1,3\n1,0\n3,2");

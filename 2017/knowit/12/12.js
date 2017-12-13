"use strict";

// Start a timer
console.time("Solved");

// Make the grid
const gridSize = 10;
class Cell {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.number = x*gridSize + y;
		this.isWhite = true;
	}
}
const grid = [];
for (let y = 0; y < gridSize; y++) {
	const row = [];
	for (let x = 0; x < gridSize; x++) {
		row[x] = new Cell(x, y);
	}
	grid[y] = row;
}

// Define the deltas the knight can move to
const deltas = [
	[1, 2],
	[1, -2],
	[2, 1],
	[2, -1],
	[-2, 1],
	[-2, -1],
	[-1, 2],
	[-1, -2]
];

// Current position of the knight
let pos = grid[0][0];

// Move the knight around
for (let i = 0; i < 200; i++) {
	// Find out where it can legally move
	const possibleMoves = deltas
	  .map(([dy, dx]) => [pos.y + dy, pos.x + dx])
	  .filter(([y, x]) => !(
		y < 0 ||
		x < 0 ||
		y >= gridSize ||
		x >= gridSize
	  ))
	  .map(([y, x]) => grid[y][x])
	  .sort((a, b) => a.number - b.number);

	// Find the lowest numbered cell with the same color as the one the knight stands on
	// Because they are sorted, 'find' finds them in order from low to high, and returns the first it finds
	let nextPos = possibleMoves.find((cell) => cell.isWhite === pos.isWhite);
	if (nextPos === undefined) {
		// No cells with the same color was found. Move to the highest numbered cell, which is the last in the array
		nextPos = possibleMoves[possibleMoves.length-1];
	}

	// Flip the color of the current cell
	pos.isWhite = !pos.isWhite;

	// Move to the next one
	pos = nextPos;
}

// Count white cells
let blacks = 0;
for (let y = 0; y < gridSize; y++) {
	for (let x = 0; x < gridSize; x++) {
		if (!grid[y][x].isWhite) {
			blacks++;
		}
	}
}

// Solved!
console.timeEnd("Solved");
console.log(blacks);

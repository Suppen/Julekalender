"use strict";

/************
 * Solve it *
 ************/

// Start a timer
console.time("Solved");

// Dimensions of the maze. Add one for calculational purposes
const width = 1000;
const height = 1000;

// Start position in the maze
const START_POS = {x: 1, y: 1};

/**
 * Checks if a cell has a wall
 *
 * @param {Integer} x	X coordinate to check
 * @param {Integer} y	Y coordinate to check
 *
 * @returns {Boolean}	True if the number corresponds to a wall, false otherwise
 */
function hasWall(x, y) {
	// Formula found in task
	const num = x**3 + 12*x*y + 5*x*y**2;

	// Count number of ones in the binary representation of the number
	const ones = num.toString(2).split("").reduce((ones, digit) => digit === "1" ? ++ones : ones, 0);

	// If the number of ones are odd, there shold be a wall. Else it is no wall
	return ones % 2 === 1;
}

/**
 * Finds the neighbour cells of a given cell
 *
 * @param {Integer} x	X coordinate to check
 * @param {Integer} y	Y coordinate to check
 *
 * @returns {Point[]}	List of valid neighbour cells
 */
function getNeighbours(width, height, x, y) {
	const neighbours = [
		{x: x-1, y},
		{x: x+1, y},
		{x, y: y-1},
		{x, y: y+1}
	];

	// Remove cells outside the maze and return
	return neighbours.filter(({x, y}) => !(
		x < 1 ||
		y < 1 ||
		x > width ||
		y > height
	));
}

/**
 * Finds all cells which are possible to reach from a start position in a maze
 *
 * @param {Integer} x	X coordinate of current cell
 * @param {Integer} y	Y coordinate of current cell
 * @param {Set} discovered	Set of discovered points
 *
 * @returns {Set}	The set of nodes (including walls) reachable from the given position
 */
function dfs(x, y, discovered = new Set()) {
	// Ignore this cell if it has already been discovered
	if (discovered.has(x + "," + y)) {
		return;
	}

	// Mark this cell as discovered
	discovered.add(x + "," + y);

	// Find all neighbour cells of this cell
	const neighbours = getNeighbours(width, height, x, y);

	// Find the neighbour paths
	const paths = neighbours.filter(({x, y}) => !hasWall(x, y));

	// Recursively search the neighbour paths
	paths.forEach(({x, y}) => dfs(x, y, discovered));

	return discovered;
}

// Find all cells reachable from 1,1
const reachable = dfs(1, 1);

// Invert it
const unreachable = new Set();
for (let y = 1; y <= height; y++) {
	for (let x = 1; x <= width; x++) {
		const coordStr = x + "," + y;
		if (!reachable.has(coordStr) && !hasWall(x, y)) {
			unreachable.add(coordStr);
		}
	}
}

// Solved!
console.timeEnd("Solved");

// The solution is the size of the unreachable set
console.log(unreachable.size);

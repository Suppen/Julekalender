"use strict";

/************
 * Solve it *
 ************/

// Start a timer
console.time("Solved");

// Start position in the maze
const START_POS = {x: 1, y: 1};

// Constants for representing cells in the maze
const WALL = "#";
const PATH = "_";

/**
 * Calculates the number for a given cell
 *
 * @param {Integer} x	X coordinate of the cell
 * @param {Integer} y	Y coordinate of the cell
 *
 * @returns {Integer}	The cell's number
 */
function getNumForCell(x, y) {
	// Formula found in task
	return x**3 + 12*x*y + 5*x*y**2;
}

/**
 * Checks if a number corresponds to a wall or a path
 *
 * @param {Integer} num	The number to check
 *
 * @returns {Boolean}	True if the number corresponds to a wall, false otherwise
 */
function hasWall(num) {
	// Count number of ones in the binary representation of the number
	const ones = num.toString(2).split("").reduce((ones, digit) => {
		if (digit === "1") {
			ones++;
		}
		return ones;
	}, 0);

	// If the number of ones are odd, there shold be a wall. Else it is no wall
	return ones % 2 === 1;
}

/**
 * Generates a maze
 *
 * @param {Integer} width	Width of the maze
 * @param {Integer} height	The height of the maze
 *
 * @returns {Something[][]}	The generated maze
 */
function generateMaze(width, height) {
	// Create the maze array
	const maze = [];

	// Generate the maze
	for (let y = 1; y <= height; y++) {
		const row = [];
		for (let x = 1; x <= width; x++) {
			row[x] = hasWall(getNumForCell(x, y)) ? WALL : PATH;
		}
		maze[y] = row;
	}

	return maze;
}

/**
 * Finds the neighbour cells of a given cell
 *
 * @param {Something[][]} maze	The maze to check
 * @param {Integer} x	X coordinate to check
 * @param {Integer} y	Y coordinate to check
 *
 * @returns {Point[]}	List of valid neighbour cells
 */
function getNeighbours(maze, x, y) {
	const neighbours = [];
	for (let dy = -1; dy <= 1; dy++) {
		for (let dx = -1; dx <= 1; dx++) {
			// Ignore the current cell
			if (!(dy === 0 && dx === 0)) {
				// Ignore the corner cells
				if (!(Math.abs(dy) === 1 && Math.abs(dx) === 1)) {
					neighbours.push({x: x+dx, y: y+dy});
				}
			}
		}
	}

	// Remove cells outside the maze and return
	return neighbours.filter(({x, y}) => !(
		x < 1 ||
		y < 1 ||
		x >= maze[1].length ||
		y >= maze.length
	));
}

/**
 * Finds all cells which are possible to reach from a start position in a maze
 *
 * @param {Something[][]} maze	The maze to check
 * @param {Integer} x	X coordinate of current cell
 * @param {Integer} y	Y coordinate of current cell
 * @param {Set} discovered	Set of discovered points
 *
 * @returns {Set}	The set of nodes (including walls) reachable from the given position
 */
function dfs(maze, x, y, discovered = new Set()) {
	// Ignore this cell if it has already been discovered
	if (discovered.has(x + "," + y)) {
		return;
	}

	// Mark this cell as discovered
	discovered.add(x + "," + y);

	// Find all neighbour cells of this cell
	const neighbours = getNeighbours(maze, x, y);

	// Find the neighbour paths
	const paths = neighbours.filter(({x, y}) => maze[y][x] === PATH);

	// Recursively search the neighbour paths
	paths.forEach(({x, y}) => dfs(maze, x, y, discovered));

	return discovered;
}

// Generate the maze
const maze = generateMaze(1000, 1000);

// Find all cells reachable from 1,1
const reachable = dfs(maze, 1, 1);

// Invert it
const unreachable = new Set();
for (let y = 1; y < maze.length; y++) {
	for (let x = 1; x < maze[y].length; x++) {
		const coordStr = x + "," + y;
		if (!reachable.has(coordStr) && maze[y][x] !== WALL) {
			unreachable.add(coordStr);
		}
	}
}

// Solved!
console.timeEnd("Solved");

// The solution is the size of the unreachable set
console.log(unreachable.size);

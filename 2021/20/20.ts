import * as fs from "fs";

const NORTH = "n";
const EAST = "e";
const SOUTH = "s";
const WEST = "w";

type Direction = typeof NORTH | typeof EAST | typeof SOUTH | typeof WEST;
type Coords = [number, number]; // [x, y]
type Maze = Record<Direction, boolean>[][];

const turnLeftMap = new Map<Direction, Direction>([
	[NORTH, WEST],
	[WEST, SOUTH],
	[SOUTH, EAST],
	[EAST, NORTH]
]);

const turnRightMap = new Map<Direction, Direction>([
	[NORTH, EAST],
	[EAST, SOUTH],
	[SOUTH, WEST],
	[WEST, NORTH]
]);

const canWalk = (dir: Direction, maze: Maze, [x, y]: Coords) => maze[y][x][dir];

const walkMap = new Map<Direction, [number, number]>([
	[NORTH, [0, -1]],
	[EAST, [1, 0]],
	[SOUTH, [0, 1]],
	[WEST, [-1, 0]]
]);
const walk = (dir: Direction, [x, y]: Coords): Coords => {
	const [dx, dy] = walkMap.get(dir);
	return [x + dx, y + dy];
};

const turnLeft = (dir: Direction): Direction => turnLeftMap.get(dir);
const turnRight = (dir: Direction): Direction => turnRightMap.get(dir);

const maze: Maze = fs.readFileSync("maze.txt", "utf-8")
	.split("\n")
	.slice(0, -1)
	.map(line => line.slice(1).slice(0, -1).split(")("))
	.map(row => row.map(cell => cell.split(",")))
	.map(row => row.map(([n,e,s,w]) => ({
		[NORTH]: n === '1',
		[EAST]: e === '1',
		[SOUTH]: s === '1',
		[WEST]: w === '1',
	})));

const endCoord = [maze[0].length-1, maze.length-1];

let pos: Coords = [0, 0];
const path = [];
let dir: Direction = SOUTH;
while (pos[0] !== endCoord[0] || pos[1] !== endCoord[1]) {
	path.push(pos);

	dir = turnLeft(dir);
	while (!canWalk(dir, maze, pos)) {
		dir = turnRight(dir);
	}

	pos = walk(dir, pos);
}

console.log(path.length);

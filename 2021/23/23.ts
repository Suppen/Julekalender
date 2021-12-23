import * as fs from "fs";

const NORTH = "n";
const EAST = "e";
const SOUTH = "s";
const WEST = "w";

type Direction = typeof NORTH | typeof EAST | typeof SOUTH | typeof WEST;
type Coords = [number, number]; // [x, y]
type Maze = Record<Direction, boolean>[][];

const canWalk = (dir: Direction, maze: Maze, [x, y]: Coords) => maze[y][x][dir];

const walkMap = new Map<Direction, [number, number]>([
	[NORTH, [0, -1]],
	[EAST, [1, 0]],
	[SOUTH, [0, 1]],
	[WEST, [-1, 0]]
]);

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

const endCoord = [maze[0].length-1, maze.length-1] as Coords;

const solve = (maze: Maze, start: Coords, end: Coords): number => {
	const toString = (coord: Coords): string => coord.join(",");
	const fromString = (str: string): Coords => str.split(",").map(Number) as Coords;
	const heuristic = (pos: Coords): number => Math.sqrt((pos[0] - end[0])**2 + (pos[1] - end[1])**2);

	const startStr = start.join(",");
	const endStr = end.join(",");

	const unvisited = new Set<string>();
	const distances = new Map<string, number>();
	distances.set(startStr, 0);

	let current = start;
	let currentStr = startStr;
	while (currentStr !== endStr) {
		unvisited.delete(currentStr);
		const distanceToHere = distances.get(currentStr);

		const neighbours = [];
		for (const direction of [NORTH, EAST, SOUTH, WEST] as const) {
			if (direction === NORTH && current[1] === 0) {
				continue;
			}

			if (canWalk(direction, maze, current)) {
				const [dx, dy] = walkMap.get(direction);
				neighbours.push([current[0] + dx, current[1] + dy]);
			}
		}

		for (const neighbour of neighbours) {
			const neighbourStr = toString(neighbour)
			const oldDistance = distances.get(neighbourStr) ?? Infinity;
			const newDistance = distanceToHere + 1;

			if (newDistance < oldDistance) {
				distances.set(neighbourStr, newDistance);
				unvisited.add(neighbourStr);
			}
		}

		let bestGuessNode = current;
		let bestGuessValue = Infinity;
		for (const nodeStr of unvisited) {
			const node = fromString(nodeStr);
			const value = distances.get(nodeStr) + heuristic(node);
			if (value < bestGuessValue) {
				bestGuessNode = node;
				bestGuessValue = value;
			}
		}
		current = bestGuessNode;
		currentStr = toString(current);
	}

	return distances.get(endStr);
};

console.log(solve(maze, [0, 0], endCoord));

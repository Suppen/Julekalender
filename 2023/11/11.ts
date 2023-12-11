import { readFileSync } from "fs";

export const squares = readFileSync("kart.txt", "utf-8")
	// Split on newlines, remove last empty line
	.split("\n")
	.slice(0, -1)
	// Turn the lines into arrays of bools
	.map(line => line.split("").map(c => c === "X"))
	// Flatten the arrays
	.reduce((acc, val) => acc.concat(val), []);

const ocean = new Ocean(squares, 1000, 1000); // Could have parsed dimensions from the data, but I'm lazy

type Coord = [number, number];
type StringCoord = `${number},${number}`;

type Node = {
	key: Coord;
	neighbours: Node[];
}

export class Ocean {
	readonly width: number;
	readonly height: number;
	#nodes: Map<StringCoord, Node>;

	constructor(squares: Readonly<boolean[]>, width: number, height: number) {
		this.width = width;
		this.height = height;
		this.#nodes = new Map();

		this.#createNodes(squares);
		this.#connectNodes();
	}

	/**
	 * Converts a 1D index to a 2D coordinate in the chocolate
	 *
	 * @param i The index
	 * @param width The width of the chocolate
	 *
	 * @returns The coordinate
	 */
	static i2xy(i: number, width: number): Coord {
		return [i % width, Math.floor(i / width)];
	}

	/**
	 * Creates all nodes in the chocolate
	 */
	#createNodes(squares: Readonly<boolean[]>) {
		for (let i = 0; i < squares.length; i++) {
			// Skip empty squares
			if (!squares[i]) continue;

			const [x, y] = Ocean.i2xy(i, this.width);
			this.#nodes.set(`${x},${y}`, { key: [x, y], neighbours: [] });
		}
	}

	/**
	 * Connects all nodes in the chocolate
	 */
	#connectNodes() {
		for (const [key, node] of this.#nodes) {
			const [x, y] = key.split(",").map(Number);

			// Find all neighbour coordinates
			[
				[x - 1, y], // Left
				[x - 1, y - 1], // Up-left
				[x + 1, y], // Right
				[x + 1, y - 1], // Up-right
				[x, y - 1], // Up
				[x - 1, y + 1], // Down-left
				[x, y + 1], // Down
				[x + 1, y + 1] // Down-right
			]
				// Filter out neighbours that do not exist
				.filter(([x, y]) => this.#nodes.has(`${x},${y}`))
				// Get the nodes from the coordinates
				.map(([x, y]) => this.#nodes.get(`${x},${y}`)!)
				// Add them to the node
				.forEach(neighbour => {
					node.neighbours.push(neighbour);
				});
		}
	}

	/**
	 * Gets the individually connected pieces of the chocolate
	 *
	 * @returns The pieces
	 */
	getPieces(): Set<Coord>[] {
		const pieces: Set<Coord>[] = []

		// Keep track of which nodes have not been visited
		let remainingNodes = [...this.#nodes.values()];

		// Perform a depth-first search on the nodes, starting somewhere abritrary
		while (remainingNodes.length > 0) {
			let current = remainingNodes[remainingNodes.length - 1];
			let stack = [current];
			let visited = new Set<Node>();

			while (stack.length > 0) {
				current = stack.pop()!;
				visited.add(current);
				remainingNodes = remainingNodes.filter(node => node !== current);

				// Add all unvisited neighbours to the stack
				for (const neighbour of current.neighbours) {
					if (!visited.has(neighbour)) {
						stack.push(neighbour);
					}
				}
			}

			const visitedCoords = [...visited].map(node => node.key);
			pieces.push(new Set(visitedCoords));
		}

		return pieces;
	}
}

const result = ocean.getPieces().length;
console.log(result);

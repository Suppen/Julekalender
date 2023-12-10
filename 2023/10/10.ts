import { readFileSync } from "fs";

export const chocolates = readFileSync("sjokkis.txt", "utf-8")
	// Split on newlines, remove last empty line
	.split("\n")
	.slice(0, -1)
	// Turn the lines into arrays of bools
	.map(line => line.split("").map(c => c === "1"))
	// Turn them into chocolate objects
	.map(squares => new Chocolate(squares, 8, 8));

type Coord = [number, number];
type StringCoord = `${number},${number}`;

type Node = {
	key: Coord;
	neighbours: Node[];
}

export class Chocolate {
	readonly width: number;
	readonly height: number;
	readonly raw: Readonly<boolean[]>;
	#nodes: Map<StringCoord, Node>;

	constructor(squares: Readonly<boolean[]>, width: number, height: number) {
		this.width = width;
		this.height = height;
		this.raw = squares;
		this.#nodes = new Map();

		this.#createNodes();
		this.#connectNodes();
	}

	/**
	 * Creates a copy of the chocolate
	 *
	 * @returns The copy
	 */
	clone(): Chocolate {
		return new Chocolate(this.raw, this.width, this.height);
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
	#createNodes() {
		for (let i = 0; i < this.raw.length; i++) {
			// Skip empty squares
			if (!this.raw[i]) continue;

			const [x, y] = Chocolate.i2xy(i, this.width);
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
				[x + 1, y], // Right
				[x, y - 1], // Up
				[x, y + 1], // Down
			]
				// Filter out neighbours that are out of bounds
				.filter(([x, y]) => x >= 0 && x < this.width && y >= 0 && y < this.height)
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

	/**
	 * Checks if the chocolate is fully connected
	 *
	 * @returns Whether the chocolate is fully connected
	 */
	isFullyConnected(): boolean {
		const pieces = this.getPieces();
		return pieces.length === 1;
	}

	/**
	 * Counts the number of squares in the chocolate
	 *
	 * @returns The number of squares in the chocolate
	 */
	squareCount() {
		return this.#nodes.size;
	}

	/**
	 * Creates a horizontal cut in the chocolate
	 *
	 * @param row The row to cut at. The cut will be below this row
	 * @param startCol The column to start the cut before
	 * @param length The length of the cut, in number of squares
	 */
	cutHorizontal(row: number, startCol: number, length: number) {
		for (let x = startCol; x < startCol + length; x++) {
			const coord1 = [x, row];
			const coord2 = [x, row + 1];
			const node1 = this.#nodes.get(`${coord1[0]},${coord1[1]}`);
			const node2 = this.#nodes.get(`${coord2[0]},${coord2[1]}`);

			if (node1 !== undefined && node2 !== undefined) {
				node1.neighbours = node1.neighbours.filter(node => node !== node2);
				node2.neighbours = node2.neighbours.filter(node => node !== node1);
			}
		}
	}

	/**
	 * Creates a vertical cut in the chocolate
	 *
	 * @param col The column to cut at. The cut will be to the right of this column
	 * @param startRow The row to start the cut before
	 * @param length The length of the cut, in number of squares
	 */
	cutVertical(col: number, startRow: number, length: number) {
		for (let y = startRow; y < startRow + length; y++) {
			const coord1 = [col, y];
			const coord2 = [col + 1, y];
			const node1 = this.#nodes.get(`${coord1[0]},${coord1[1]}`)!;
			const node2 = this.#nodes.get(`${coord2[0]},${coord2[1]}`)!;

			if (node1 !== undefined && node2 !== undefined) {
				node1.neighbours = node1.neighbours.filter(node => node !== node2);
				node2.neighbours = node2.neighbours.filter(node => node !== node1);
			}
		}
	}

	/**
	 * Creates a list of all possible cuts in the chocolate
	 *
	 * @returns List of the possible cuts
	 */
	possibleCuts(): ["horizontal" | "vertical", number, number, number][] {
		const cuts: ["horizontal" | "vertical", number, number, number][] = [];

		// Horizontal cuts
		for (let row = 0; row < this.height - 1; row++) {
			for (let startCol = 0; startCol < this.width; startCol++) {
				for (let length = 1; length + startCol <= this.width; length++) {
					cuts.push(["horizontal", row, startCol, length]);
				}
			}
		}

		// Vertical cuts
		for (let col = 0; col < this.width - 1; col++) {
			for (let startRow = 0; startRow < this.height; startRow++) {
				for (let length = 1; length + startRow <= this.height; length++) {
					cuts.push(["vertical", col, startRow, length]);
				}
			}
		}

		return cuts;
	}
}

// All chocolates are the same size, so we save time by doing `possibleCuts` once
const possibleCuts = chocolates[0].possibleCuts();

/**
 * Checks if the chocolate is up to standard, following the rules in the task. Cut the chocolate before calling this method.
 *
 * @returns Whether the chocolate is up to standard
 */
const isUpToStandard = (chocolate: Chocolate): boolean =>
	possibleCuts.some(([direction, ...args]) => {
		// Clone the chocolate so we don't modify the original
		const clone = chocolate.clone();

		// Cut the clone
		clone[direction === "horizontal" ? "cutHorizontal" : "cutVertical"](...args);

		const pieces = clone.getPieces();

		// The standard says there should be two pieces of equal size
		if (pieces.length !== 2) return false;
		const [piece1, piece2] = pieces;
		return piece1.size === piece2.size;
	});

const result = chocolates.filter(chocolate => isUpToStandard(chocolate)).length;
console.log(result);

import * as fs from "fs";

const syms = ['🎅', '⛄', '✨', '🎄'] as const;
type Sym = (typeof syms)[number];

type Board = Sym[];

const isBoard = (list: string[]): list is Board =>
	list.length === 16 &&
	list.every(sym => (syms as readonly string[]).includes(sym));

const toString = (board: Board): string => board.join("");
const fromString = (str: string): Board => [...str] as Board;

const readBoards = (filename: string): Board[] => {
	const boards = fs.readFileSync(filename, "utf-8")
	.split('\n')
	.slice(0, -1)
	.map(fromString);

	if (!boards.every(isBoard)) {
		throw new Error("")
	}

	return boards;
};

const solved: Board = fromString("🎅🎅🎅🎅⛄⛄⛄⛄✨✨✨✨🎄🎄🎄🎄");

const rows = ["R1", "R2", "R3", "R4"] as const;
type Row = (typeof rows)[number];
const cols = ["C1", "C2", "C3", "C4"] as const;
type Col = (typeof cols)[number];

type Index = number;

const linePosMap = new Map<Row | Col, Index[]>([
	["C1", [0, 4, 8, 12]],
	["C2", [1, 5, 9, 13]],
	["C3", [2, 6, 10, 14]],
	["C4", [3, 7, 11, 15]],
	["R1", [0, 1, 2, 3]],
	["R2", [4, 5, 6, 7]],
	["R3", [8, 9, 10, 11]],
	["R4", [12, 13, 14, 15]]
]);

const rotateRow = (board: Board, row: Row, direction: "R" | "L"): Board => {
	const indices = linePosMap.get(row);
	const offset = direction === "R" ? indices.length - 1 : 1;
	return rotate(board, indices, offset);
};

const rotateCol = (board: Board, col: Col, direction: "U" | "D"): Board => {
	const indices = linePosMap.get(col);
	const offset = direction === "D" ? indices.length - 1 : 1;
	return rotate(board, indices, offset);
};

const rotate = (board: Board, indices: Index[], offset: number): Board => {
	const newBoard = [...board];

	for (let i = 0; i < indices.length; i++) {
		const j = (i + offset) % indices.length;
		newBoard[indices[i]] = board[indices[j]];
	}

	return newBoard;
};

const getNeighbours = (board: Board): Board[] => [
	...rows.map(row => rotateRow(board, row, "R")),
	...rows.map(row => rotateRow(board, row, "L")),
	...cols.map(col => rotateCol(board, col, "U")),
	...cols.map(col => rotateCol(board, col, "D")),
];

interface N<T> {
	elem: T;
	next: N<T> | null;
}
class LinkedList<T> {
	private head: N<T> | null = null;
	private last: N<T> | null = null;

	public shift(): T {
		if (this.head === null) {
			throw new Error("List empty");
		}

		const { elem, next } = this.head;
		this.head = next;
		if (this.head === null) {
			this.last = null;
		}

		return elem;
	}

	public push(elem: T) {
		const newNode = { elem, next: null };

		if (this.last === null) {
			this.last = newNode;
			this.head = newNode;
		} else {
			this.last.next = newNode;
			this.last = newNode;
		}
	}
}

const bfs = (start: Board, targets: Board[]): number => {
	const splitKey = (key: string): readonly [string, string] => [key.slice(0, 4), key.slice(4)] as const;

	const startStr = toString(start);
	const [k1, k2] = splitKey(startStr);
	const distances: Map<string, Map<string, number>> = new Map([
		[k1, new Map([
			[k2, 0]
		])]
	]);
	const queue = new LinkedList<string>();
	queue.push(startStr);

	const remainingTargets = new Set(targets.map(toString));

	let targetDistances = 0;

	while (remainingTargets.size > 0) {
		const boardStr = queue.shift();
		const board = fromString(boardStr);

		const [k1, k2] = splitKey(boardStr);
		const distance = distances.get(k1).get(k2);

		getNeighbours(board)
			.map(toString)
			.filter(neighbour => {
				const [k1, k2] = splitKey(neighbour);
				return distances.get(k1)?.get(k2) === undefined;
			})
			.forEach(neighbour => {
				const neighbourDistance = distance + 1;

				const [k1, k2] = splitKey(neighbour);
				const m = distances.get(k1) ?? new Map<string, number>();
				m.set(k2, neighbourDistance);
				distances.set(k1, m);

				queue.push(neighbour);

				if (remainingTargets.has(neighbour)) {
					targetDistances += neighbourDistance;
					console.log(neighbourDistance, targetDistances, neighbour, remainingTargets.size - 1);
					remainingTargets.delete(neighbour);
				}
			});
	};

	return targetDistances;
};

const main = (): void => {
	const boards = readBoards("boards.txt");

	const answer = bfs(solved, boards);

	console.log(answer);
};

main();

"use strict";

const fs = require("fs");
const R = require("ramda");

const maze = JSON.parse(fs.readFileSync("input.txt", "utf-8"));

const traverse = (maze, bot) => {
	// Initialize
	let i = 0;
	const startPos = [0, 0]; // [x, y]
	const visited = new Set([getRoom(startPos, maze)]);
	const path = [startPos];

	// While the last step in the path is not the end room
	while (!R.equals(R.last(path), [499, 499])) {
		// Get the current position
		const currentPos = R.last(path);

		// Get the current room situation
		const rooms = getRooms(currentPos, maze);

		// Give it to the bot
		const [newRoom, newPos] = bot(rooms, isVisited(visited));

		// Check if the bot entered a new room
		if (!newRoom) {
			// Nope. go back one step
			path.pop();
		} else {
			// Yes! Go there, and mark it as visited
			path.push(newPos);
			visited.add(getRoom(newPos, maze));
		}
	}

	return visited.size;
}

const getRoom = ([x, y], maze) => R.tryCatch(() => maze[y][x], R.always(undefined))(null)

const getRooms = ([x, y], maze) => ({
	current: getRoom([x, y], maze),
	nord: getRoom([x, y-1], maze),
	aust: getRoom([x+1, y], maze),
	syd: getRoom([x, y+1], maze),
	vest: getRoom([x-1, y], maze)
});

const getRoomPos = R.props(["x", "y"]);

const isVisited = R.curry((visited, room) =>
	visited.has(room)
);

const arthur = (rooms, isVisited, prevPos) => {
	if (!rooms.current.syd && !isVisited(rooms.syd)) {
		return [true, getRoomPos(rooms.syd)];
	} else if (!rooms.current.aust && !isVisited(rooms.aust)) {
		return [true, getRoomPos(rooms.aust)];
	} else if (!rooms.current.vest && !isVisited(rooms.vest)) {
		return [true, getRoomPos(rooms.vest)];
	} else if (!rooms.current.nord && !isVisited(rooms.nord)) {
		return [true, getRoomPos(rooms.nord)];
	} else {
		return [false];
	}
}

const isaac = (rooms, isVisited, prevPos) => {
	if (!rooms.current.aust && !isVisited(rooms.aust)) {
		return [true, getRoomPos(rooms.aust)];
	} else if (!rooms.current.syd && !isVisited(rooms.syd)) {
		return [true, getRoomPos(rooms.syd)];
	} else if (!rooms.current.vest && !isVisited(rooms.vest)) {
		return [true, getRoomPos(rooms.vest)];
	} else if (!rooms.current.nord && !isVisited(rooms.nord)) {
		return [true, getRoomPos(rooms.nord)];
	} else {
		return [false];
	}
}

const res = Math.abs(traverse(maze, arthur) - traverse(maze, isaac));
console.log(res);

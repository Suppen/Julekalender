"use strict";

/**************************
 * Import important stuff *
 **************************/

const fs = require("fs");

/************
 * Solve it *
 ************/

// Start a timer
console.time("Solved");

/***************
 * Dance moves *
 ***************/

function spin(programs, spin) {
	// Cycle the programs around 'spin' times
	for (let j = 0; j < spin; j++) {
		const tmp = programs.pop();
		programs.unshift(tmp);
	}
}

function exchange(programs, a, b) {
	// Swap the programs at the indicated positions
	const tmp = programs[a];
	programs[a] = programs[b];
	programs[b] = tmp;
}

function partners(programs, a, b) {
	// Same as exchange, but have to find the indices first
	const ia = programs.findIndex((p) => p === a);
	const ib = programs.findIndex((p) => p === b);

	exchange(programs, ia, ib);
}

function doMove(programs, move) {
	// Find out what to do
	if (move.type === "spin") {
		spin(programs, move.spin);
	} else if (move.type === "exchange") {
		exchange(programs, move.exchange[0], move.exchange[1]);
	} else if (move.type === "partner") {
		partners(programs, move.partners[0], move.partners[1]);
	}
}

function dance(programs, moves) {
	moves.forEach((move) => doMove(programs, move));
}

/******************
 * Do the dancing *
 ******************/

// Read and parse the input
const moves = fs.readFileSync("input.txt", "utf-8")
  .trim()
  .split(",")
  .map((move) => {
	let moveObj = null;

	// Find out what type of move this is
	const moveChar = move.charAt(0);
	if (moveChar === 's') {
		// A spin. The spin number is directly after the 's'
		moveObj = {
			type: "spin",
			spin: Number.parseInt(move.slice(1))
		};
	} else if (moveChar === 'x') {
		// An exchange. The indices are immediately following the 'x' and are separated by a slash
		const i = move.indexOf('/');
		const a = Number.parseInt(move.slice(1, i));
		const b = Number.parseInt(move.slice(i+1));
		moveObj = {
			type: "exchange",
			exchange: [a, b]
		};
	} else if (moveChar === 'p') {
		// Partner. The program names are immediately following the 'p' and are separated by a slash
		const i = move.indexOf('/');
		const a = move.slice(1, i);
		const b = move.slice(i+1);
		moveObj = {
			type: "partner",
			partners: [a, b]
		};
	} else {
		throw new Error("Invalid move:", move);
	}

	return moveObj;
  });

// Make the initial program list
const initialProgramString = "abcdefghijklmnop";
let programs = initialProgramString.split("");

// Find out how many cycles it takes the programs to get back to the original order
let cyclesToReset = 0;
do {
	dance(programs, moves);
	cyclesToReset++;
} while (programs.join("") !== initialProgramString);

// Calculate how many iterations are left after the dance has returned to its initial state for the final time in the 1 billion iterations
const remainingIterations = (10**9) % cyclesToReset;

// Do the last iterations
for (let i = 0; i < remainingIterations; i++) {
	dance(programs, moves);
}

// Solved!
console.timeEnd("Solved");
console.log(programs.join(""));

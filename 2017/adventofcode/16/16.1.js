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
const programs = "abcdefghijklmnop".split("");

// Dance!
for (const move of moves) {
	// Find out what to do
	if (move.type === "spin") {
		// Cycle the programs around 'spin' times
		for (let i = 0; i < move.spin; i++) {
			const tmp = programs.pop();
			programs.unshift(tmp);
		}
	} else if (move.type === "exchange") {
		// Swap the programs at the indicated positions
		const tmp = programs[move.exchange[0]];
		programs[move.exchange[0]] = programs[move.exchange[1]];
		programs[move.exchange[1]] = tmp;
	} else if (move.type === "partner") {
		// Same as exchange, but have to find the indices first
		const ia = programs.findIndex((p) => p === move.partners[0]);
		const ib = programs.findIndex((p) => p === move.partners[1]);

		const tmp = programs[ia];
		programs[ia] = programs[ib];
		programs[ib] = tmp;
	}
}

// Solved!
console.timeEnd("Solved");
console.log(programs.join(""));

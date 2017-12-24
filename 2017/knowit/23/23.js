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

class TicTacToe {
	constructor() {
		// Create the grid
		this.grid = new Array(10).fill(TicTacToe.BLANK);

		// X always starts
		this.whoseTurn = TicTacToe.X;

		// Keep track of how many cells are filled
		this.filledCells = 0;

		// Keep track of the winner
		this.winner = TicTacToe.NONE;
	}

	/**
	 * Marks a cell with the current player's symbol and tells who won
	 *
	 * @param {Integer} cell	Which cell to play
	 *
	 * @returns {Something}	The winner. Either TicTacToe.X, TicTacToe.O, TicTacToe.NONE or TicTacToe.DRAW.
	 */
	mark(cell) {
		// Mark the cell for the current player
		this.grid[cell] = this.whoseTurn;

		// Increase number of marked cells
		this.filledCells++;

		// Check for wins
		if (this.filledCells >= 3) {
			const won = TicTacToe.winCombinations.find(([a, b, c]) => (
				this.grid[a] !== TicTacToe.BLANK &&
				this.grid[a] === this.grid[b] &&
				this.grid[b] === this.grid[c]
			)) !== undefined;
			if (won) {
				// This player won
				this.winner = this.whoseTurn;
			}
		}

		// If 9 cells are filled and there is no winner, it is a draw
		if (this.winner === TicTacToe.NONE && this.filledCells === 9) {
			this.winner = TicTacToe.DRAW;
		}

		// Swap player
		if (this.whoseTurn === TicTacToe.X) {
			this.whoseTurn = TicTacToe.O;
		} else {
			this.whoseTurn = TicTacToe.X
		}

		return this.winner;
	}

	static get BLANK() {
		return " ";
	}

	static get X() {
		return "X";
	}

	static get O() {
		return "O";
	}

	static get NONE() {
		return "NONE";
	}

	static get DRAW() {
		return "DRAW";
	}

	/**
	 * Array of possible win combinations
	 *
	 * @type {Integer[][]}
	 */
	static get winCombinations() {
		return [
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
			[1, 4, 7],
			[2, 5, 8],
			[3, 6, 9],
			[1, 5, 9],
			[3, 5, 7]
		];
	}

	toString() {
		return this.grid.slice(1, 4).join("") + "\n" + this.grid.slice(4, 7).join("") + "\n" + this.grid.slice(7, 10).join("");
	}
}

// Play the game
let OpheliaWins = 0;
let XenaWins = 0;
let board = new TicTacToe();
let O = "Ophelia";
let drawsInARow = 0;
fs.readFileSync("moves.txt", "utf-8")
  .trim()
  .split("")
  .map((num) => Number.parseInt(num))
  .forEach((cell) => {
	// Fill the cell and check if someone won
	const winner = board.mark(cell);
	if (winner !== TicTacToe.NONE) {
		// Check who won
		if (winner === TicTacToe.O) {
			// Count the win, and the players keep their symbol
			if (O === "Ophelia") {
				OpheliaWins++;
			} else if (O === "Xena") {
				XenaWins++;
			}
			drawsInARow = 0;
		} else if (winner === TicTacToe.X) {
			// Count the win, and the players swap symbols
			if (O === "Xena") {
				OpheliaWins++;
				O = "Ophelia";
			} else if (O === "Ophelia") {
				XenaWins++;
				O = "Xena";
			}
			drawsInARow = 0;
		} else {
			// A draw
			if (++drawsInARow === 3) {
				// Swap symbols
				if (O === "Ophelia") {
					O = "Xena";
				} else if (O === "Xena") {
					O = "Ophelia";
				}

				// Reset counter
				drawsInARow = 0;
			}
		}
		// Create a new board
		board = new TicTacToe();
	}
});

const mostWins = Math.max(OpheliaWins, XenaWins);

// Solved!
console.timeEnd("Solved");
console.log(mostWins);

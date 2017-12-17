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

// Read the file
const prisonersOrder = fs.readFileSync("prisoners.txt", "utf-8")
  .trim()
  .split("\n")
  .map((num) => Number.parseInt(num));

// Find the highest numbered prisoner
const numberOfPrisoners = prisonersOrder.reduce((highest, current) => Math.max(highest, current));

// Prisoner 1 is the leader
const leader = 1;

// Keep track of the bulb's state
let bulbIsLit = false;

// Keep track of who has turned the bulb on
const hasTurnedOn = new Set();

// Keep track of how many times the leader has turned off the bulb
let leaderHasTurnedOffBulb = 0;

// Start processing the prisoners
let turnNumber = 0;
while (turnNumber < prisonersOrder.length && leaderHasTurnedOffBulb < numberOfPrisoners) {
	// Get the number of the prisoner being led to the room
	const prisoner = prisonersOrder[turnNumber];

	if (prisoner === leader && bulbIsLit) {
		// The leader counts +1 and turns the light off again
		bulbIsLit = false;
		leaderHasTurnedOffBulb++;
	} else if (!hasTurnedOn.has(prisoner) && !bulbIsLit) {
		// The prisoner turns it on if he has not already done so in the past
		bulbIsLit = true;
		hasTurnedOn.add(prisoner);
	}

	// Fetch the next prisoner
	turnNumber++;
}

// Solved!
console.timeEnd("Solved");
console.log(turnNumber);

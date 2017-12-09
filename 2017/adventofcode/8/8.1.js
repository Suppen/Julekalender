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

// Names of all the registers
const registerNames = new Set();

// Create the registers
const registers = new Proxy({}, {
	get(target, property) {
		if (!(property in target)) {
			target[property] = 0;
			registerNames.add(property);
		}
		return target[property];
	}
});

// Read the file
const instructions = fs.readFileSync("input.txt", "utf-8")
  .split("\n")	// Split it into individual lines
  .filter((line) => line !== "")	// Remove the last, empty line
  .map((line) => line.split(" "))	// Split the lines into individual parts
  .forEach(([registerName, operation, amount, , conditionalRegister, comparator, number]) => {
	// Check the condition
	const conditionalRegisterValue = registers[conditionalRegister];
	const conditionalNumber = Number.parseInt(number);
	let conditionResult = null;
	switch(comparator) {
		case "==":
			conditionResult = (conditionalRegisterValue === conditionalNumber);
			break;
		case "!=":
			conditionResult = (conditionalRegisterValue !== conditionalNumber);
			break;
		case ">=":
			conditionResult = (conditionalRegisterValue >= conditionalNumber);
			break;
		case "<=":
			conditionResult = (conditionalRegisterValue <= conditionalNumber);
			break;
		case ">":
			conditionResult = (conditionalRegisterValue > conditionalNumber);
			break;
		case "<":
			conditionResult = (conditionalRegisterValue < conditionalNumber);
			break;
		default:
			throw new Error("Invalid comparator:", comparator);
			break;
	}

	// Check if the condition passed
	if (conditionResult) {
		const amountNumber = Number.parseInt(amount);
		switch(operation) {
			case "inc":
				registers[registerName] += amountNumber;
				break;
			case "dec":
				registers[registerName] -= amountNumber;
				break;
			default:
				throw new Error("Invalid operation:", operation);
				break;
		}
	}
	
  });

// Find the highest number in a register
const maxValue = [...registerNames].reduce((max, name) => Math.max(max, registers[name]), -Infinity);

// Solved!
console.timeEnd("Solved");
console.log(maxValue);

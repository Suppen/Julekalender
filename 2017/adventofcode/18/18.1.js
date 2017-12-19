"use strict";

/**************************
 * Import important stuff *
 **************************/

const fs = require("fs");
const EventEmitter = require("events").EventEmitter;

/************
 * Solve it *
 ************/

// Start a timer
console.time("Solved");

class Asm extends EventEmitter {
	constructor(code) {
		super();

		this._code = code;

		this._ip = 0;

		this._registers = new Proxy({}, {
			get(target, property) {
				if (!(property in target)) {
					target[property] = 0;
				}
				return target[property];
			},
			set(target, property, value) {
				target[property] = value;
				return true;
			}
		});

		this._lastPlayedSound = 0;
	}

	_getVal(val) {
		let num = Number.parseInt(val);
		if (Number.isNaN(num)) {
			num = this._registers[val];
		}
		return num;
	}

	snd(reg) {
		this._lastPlayedSound = this._registers[reg];
	}

	set(reg, val) {
		this._registers[reg] = this._getVal(val);
	}

	add(reg, val) {
		this._registers[reg] = this._registers[reg] + this._getVal(val);
	}

	mul(reg, val) {
		this._registers[reg] = this._registers[reg] * this._getVal(val);
	}

	mod(reg, val) {
		this._registers[reg] = this._registers[reg] % this._getVal(val);
	}

	rcv(reg) {
		if (this._registers[reg] !== 0) {
			this._registers[reg] = this._lastPlayedSound;
			this.emit("recovered", this._registers[reg]);
		}
	}

	jgz(reg, val) {
		const value = this._getVal(reg);
		if (value > 0) {
			this._ip += this._getVal(val)-1;	// -1 to compensate for the increase of the IP
		}
	}

	step() {
		// Get the code at the line pointed to by the instruction pointer
		const line = this._code[this._ip];

		// Run it
		this[line.instruction](line.register, line.value);

		// Increase the IP
		this._ip++;
	}
}

// Read the file
const code = fs.readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split(" "))
  .map(([instruction, register, value]) => {
	return {
		instruction,
		register,
		value
	};
  });

// Create the program
const program = new Asm(code);

// Listen for the 'recovered' event to know when to stop
let recovered = null;
program.once("recovered", (data) => recovered = data);

// Run the program until something useful has been recovered
while (recovered === null) {
	program.step();
}

// Solved!
console.timeEnd("Solved");
console.log(recovered);

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
	constructor(code, pid) {
		super();

		// The program's code
		this._code = code;

		// Instruction pointer
		this._ip = 0;

		// Registers of the program. They all initialize to 0 when first accessed
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

		// Register p initially contains the pid
		this._registers.p = pid;
		this._pid = pid;

		// Whether or not the program is waiting to receive
		this.waiting = false;

		// Whether or not the program has terminated
		this.terminated = false;

		// Received, but not yet processed numbers
		this._receiveQueue = [];

		// Partner program to send and receive with. Must be set manually
		this.partner = null;
	}

	_getVal(val) {
		let num = Number.parseInt(val);
		if (Number.isNaN(num)) {
			num = this._registers[val];
		}
		return num;
	}

	snd(reg) {
		const val = this._getVal(reg);
		this.partner._receiveQueue.push(val);
		this.emit("sent", val);
	}

	rcv(reg) {
		if (this._receiveQueue.length > 0) {
			// Get the next item in the queue, if one exists
			this._registers[reg] = this._receiveQueue.shift();;
		} else {
			// None exists. Check if the partner program is currently waiting
			if (this.partner.waiting) {
				// Deadlock. Terminate
				this.terminate();
			} else {
				// Wait for it to send something before finishing
				this.waiting = true;
				this.partner.once("sent", () => {
					this.waiting = false;
					this.rcv(reg);
				});
			}
		}
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

	jgz(reg, val) {
		const value = this._getVal(reg);
		if (value > 0) {
			this._ip += this._getVal(val)-1;	// -1 to compensate for the increase of the IP
		}
	}

	terminate() {
		if (!this.terminated) {
			this.terminated = true;
			this.emit("terminated");
		}
	}

	step() {
		if (this.terminated) {
			throw new Error();
		}

		// Get the code at the line pointed to by the instruction pointer
		const line = this._code[this._ip];

		// Run it
		try {
			this[line.instruction](line.register, line.value);
		} catch (err) {
			console.error(err);
			this.terminate();
		}

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
const program0 = new Asm(code, 0);
const program1 = new Asm(code, 1);
program0.partner = program1;
program1.partner = program0;
program0.once("terminate", () => program1.terminate());
program1.once("terminate", () => program0.terminate());

// Find out how many times program 1 sends something
let sent = 0;
program1.on("sent", () => sent++);

// Wrap stuff to be able to use async/await
(async function () {
	// Run the programs until they both terminale
	while (!program0.terminated && !program1.terminated) {
		while (!program0.waiting && !program0.terminated) {
			program0.step();
		}
		while (!program1.waiting && !program1.terminated) {
			program1.step();
		}
	}

	// Solved!
	console.timeEnd("Solved");
	console.log(sent);
}());

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

class Particle {
	constructor(id, posX, posY, posZ, velX, velY, velZ, accX, accY, accZ) {
		this.id = id;
		this.pos = [posX, posY, posZ];
		this.vel = [velX, velY, velZ];
		this.acc = [accX, accY, accZ];
	}

	accelerate() {
		this.vel[0] += this.acc[0];
		this.vel[1] += this.acc[1];
		this.vel[2] += this.acc[2];
	}

	move() {
		this.pos[0] += this.vel[0];
		this.pos[1] += this.vel[1];
		this.pos[2] += this.vel[2];
	}

	update() {
		this.accelerate();
		this.move();
	}

	get manhattanDistanceToOrigo() {
		return Math.abs(this.pos[0]) + Math.abs(this.pos[1]) + Math.abs(this.pos[2]);
	}
}

// Read and parse the file
const particles = fs.readFileSync("input.txt", "utf-8")
  .replace(/[^\d\n-]/g, " ")	// Get rid of everything but digits, minuses and newlines
  .replace(/ +/g, " ")	// Collapse multiple spaces to one
  .trim()	// Remove the last, empty line
  .split("\n")	// Split into individual lines
  .map((line) => line.trim())	// Get rid of initial and trailing spaces
  .map((line) => line.split(" "))	// Split into individual fields
  .map((line) => line.map((num) => Number.parseInt(num)))	// Make sure everything are numbers
  .map((line, i) => new Particle(i, ...line));	// Turn them into particles

// Move them around for a bit
for (let i = 0; i < 10000; i++) {
	particles.forEach((particle) => particle.update());
}

// See which is closest to origo
const closest = particles.reduce((closest, particle) => {
	if (particle.manhattanDistanceToOrigo < closest.manhattanDistanceToOrigo) {
		closest = particle;
	}
	return closest;
});

// Solved! (Hopefully...)
console.timeEnd("Solved");
console.log(closest.id);

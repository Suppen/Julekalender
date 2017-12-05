"use strict";

/**********************************************************************************************************************
 * I could not complete this task. The solution is, according to the gist, "Steganography is awesome and you Knowit!" *
 **********************************************************************************************************************/

const fs = require("fs");

const bits = fs.readFileSync("bilde.ppm", "utf-8")
  .split("\n")	// Split into pixel rows
  .filter((line, i) => i > 3)	// Ignore the first four lines
  .map((line) => line.split(/\s+/g))	// Split rows into individual pixels
  .map((line) => line.filter((num, i) => i % 3 === 0))	// Pick only the RED channel
  .map((line) => line.map((num) => Number.parseInt(num)))	// Turn the pixels into numbers
  .map((line) => line.filter((num) => !Number.isNaN(num)))	// Remove NaN
  .map((line) => line.map((num) => num & 1))	// Take the least significant bit (LSB)
  .reduce((bits, line) => {	// Flatten the arrays
	line.forEach((bit) => bits.push(bit));
	return bits;
  }, [])

// Make a PBM image of the data
const image = [];
for (let i = 0; i < bits.length; i += 1280) {
	const pixels = bits
	  .slice(i, i+(1280))	// A whole pixel row
	  .map((bit) => bit ^ 1)	// 0 is white in pbm (but black in pgm and ppm). Invert it so that 1 is actually displayed as white
	  .join(" ")
	image.push(pixels);
}
fs.writeFile("out.pbm", `P1\n${1280} ${1024}\n` + image.join("\n"), () => {});

// Convert it to bytes and write it to file
const bytes = [];
for (let i = 0; i < bits.length; i += 8) {
	bytes.push(Number.parseInt(bits.slice(i, i+8).join(""), 2));
}
const buf = Buffer.from(bytes);
fs.writeFileSync("out", buf);

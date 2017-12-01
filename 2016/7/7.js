"use strict";

const fs = require("fs");

let skattekart = fs.readFileSync("skattekart.txt", "utf-8");

console.time();

let pos = skattekart.split("\r\n").reduce((pos, line) => {
	line = line.split(" ");
	let length = Number.parseInt(line[1]);
	switch (line[3]) {
		case "north":
			pos[0] += length;
			break;
		case "east":
			pos[1] -= length;
			break;
		case "south":
			pos[0] -= length;
			break;
		case "west":
			pos[1] += length;
			break;
	}
	return pos;
}, [0, 0]);

console.log(pos);
console.timeEnd();

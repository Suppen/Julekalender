"use strict";

const fs = require("fs");

const forest = fs.readFileSync("forest.txt", "utf-8").split("\n");
forest.pop(); // Remove the last, empty line

let trunks = 0;

for (let x = 0; x < forest[forest.length-1].length; x++) {
	if (forest[forest.length-1][x] !== "#") {
		continue;
	}

	let y = 0;
	while (forest[y][x] !== "#") {
		y++;
	}

	trunks += forest.length - y;
}

console.log(trunks / 5 * 200);

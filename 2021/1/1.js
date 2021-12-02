"use strict";

const fs = require("fs");

const numberwords = [
		["elleve", 11], ["tolv", 12], ["tretten", 13],
		["fjorten", 14], ["femten", 15], ["seksten", 16],
		["sytten", 17], ["atten", 18], ["nitten", 19],
		["tjue", 20], ["tretti", 30], ["førti", 40],
		["femti", 50], ["en", 1], ["to", 2],
		["tre", 3], ["fire", 4], ["fem", 5],
		["seks", 6], ["sju", 7], ["åtte", 8],
		["ni", 9], ["ti", 10],
];

let content = fs.readFileSync("tall.txt", "utf-8");

let sum = 0;
while (content.length > 1) {
	for (let i = 0; i < numberwords.length; i++) {
		if (content.startsWith(numberwords[i][0])) {
			sum += numberwords[i][1];

			content = content.slice(numberwords[i][0].length);

			break;
		}
	}
}

console.log(sum);

"use strict";

const fs = require("fs");
const crypto = require("crypto");

console.time("Solved");

function md5(str) {
	const hash = crypto.createHash("md5");
	hash.update(str);
	return hash.digest("hex");
}

fs.promises.readFile("input.txt", "utf-8")
	.then(JSON.parse)
	.then(data => {
		const chars = [];
		let currentHash = md5("julekalender");
		while (data.length > 0) {
			// Find the next character in the sequence
			const i = data.findIndex(({ ch, hash }) => md5(currentHash + ch) === hash);

			// Extract and delete the element from the data
			const [elem] = data.splice(i, 1);

			// Update values
			currentHash = elem.hash;
			chars.push(elem.ch);
		}

		return chars.join("");
	})
	.then(res => {
		console.timeEnd("Solved");
		console.log(res);
	})
	.catch(err => console.error(err))

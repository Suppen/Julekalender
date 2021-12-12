"use strict";

const fs = require("fs");

fs.promises.readFile("./task.txt", "utf-8")
	.then(content => content.split("\n").slice(0,-1))
	.then(lines => lines.map(line => {
		const [, dashes, type, name] = /^(-*)(K|G) (.*)$/.exec(line);
		return {
			level: dashes.length,
			type,
			name
		};
	}))
	.then(lines => {
		let i = 0;
		while (i < lines.length-1) {
			if (lines[i].type === "K" && lines[i+1].level <= lines[i].level) {
				lines.splice(i, 1);
				i--;
			} else {
				i++;
			}
		}

		return lines;
	})
	.then(lines => lines.filter(({ type }) => type === "K"))
	.then(lines => console.log(lines.length));

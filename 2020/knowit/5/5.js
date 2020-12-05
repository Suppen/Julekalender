"use strict";

const fs = require("fs");

const path = fs.readFileSync("rute.txt", "utf-8");

const findVertices = path => {
	let x = 0;
	let y = 0;

	const vertices = [];

	for (let i = 0; i < path.length; i++) {
		// XXX Exploits the fact that path[-1] is undefined to make the first vertex. Also ignores the last one
		if (path[i-1] !== path[i]) {
			vertices.push([x, y]);
		}

		if (path[i] === "H") {
			x++;
		} else if (path[i] === "V") {
			x--;
		} else if (path[i] === "O") {
			y--;
		} else if (path[i] === "N") {
			y++;
		}
	}

	return vertices;
};

const calculateArea = vertices => {
	const X = 0;
	const Y = 1;
	let area = 0;
	let j = vertices.length-1;
	for (let i = 0; i < vertices.length; i++) {
		area += (vertices[j][X] + vertices[i][X]) * (vertices[j][Y] - vertices[i][Y]);
		j = i;
	}

	return Math.abs(area) / 2;
};

console.log(calculateArea(findVertices(path)));

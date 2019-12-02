"use strict";

const fs = require("fs");
const R = require("ramda");

R.compose(
	console.log.bind(console),
	R.sum,
	R.map(n => n - 1),
	R.map(R.length),
	l => l.match(/# +(?=#)/g)
)(fs.readFileSync("./input.txt", "utf-8"));

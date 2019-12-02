"use strict";

const fs = require("fs");
const R = require("ramda");

R.compose(
	console.log.bind(console),
	R.reduce((count, c) => count + (c === " " ? 1 : 0), 0),
	R.split(""),
	R.join(""),
	R.map(R.trim()),
	R.split("\n")
)(fs.readFileSync("./input.txt", "utf-8"));

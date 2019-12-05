"use strict";

const fs = require("fs");
const R = require("ramda");

R.compose(
	console.log.bind(console),
	R.join(""),
	R.reverse,
	list => R.splitAt(list.length / 2, list),
	R.join(""),
	R.map(R.reverse),
	R.splitEvery(2),
	R.join(""),
	R.reverse,
	R.splitEvery(3),
	R.trim,
)(fs.readFileSync("./input.txt", "utf-8"));

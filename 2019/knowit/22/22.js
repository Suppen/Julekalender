"use strict";

const fs = require("fs");
const R = require("ramda");

R.compose(
	console.log.bind(console),
	l => l / 5 * 200,
	R.length,
	R.join(""),
	R.map(R.trim),
	R.map(R.join("")),
	R.filter(l => !R.equals(" ", R.last(l))),
	R.transpose,
	R.map(R.split("")),
	R.split("\n")
)(fs.readFileSync("forest.txt", "utf-8"));

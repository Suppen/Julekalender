"use strict";

const fs = require("fs");
const R = require("ramda");

const x = 0;
const y = 1;
const z = 2;

const getNormal = (p1, p2, p3) => {
	// https://stackoverflow.com/a/23709352
	const a = [p2[x] - p1[x], p2[y] - p1[y], p2[z] - p1[z]];
	const b = [p3[x] - p1[x], p3[y] - p1[y], p3[z] - p1[z]];

	return [
		a[y] * b[z] - a[z] * b[y],
		a[z] * b[x] - a[x] * b[z],
		a[x] * b[y] - a[y] * b[x]
	];
}

R.compose(
	data => fs.writeFileSync("model.stl",
		"solid thing\n" +
		data +
		"endsolid thing"
	),
	R.join("\n"),
	R.map(([n, [p1, p2, p3]]) =>
		`facet normal ${n[x]} ${n[y]} ${n[z]}\n` +
		`	outer loop\n` +
		`		vertex ${p1[x]} ${p1[y]} ${p1[z]}\n` +
		`		vertex ${p2[x]} ${p2[y]} ${p2[z]}\n` +
		`		vertex ${p3[x]} ${p3[y]} ${p3[z]}\n` +
		`	endloop\n` +
		`endfacet`
	),
	R.map(ps => [getNormal(...ps), ps]),
	R.map(R.splitEvery(3)),
	R.map(R.map(Number)),
	R.map(R.split(",")),
	R.split("\n"),
	R.trim,
)(fs.readFileSync("input.txt", "utf-8"));

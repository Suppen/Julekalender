"use strict";

const fs = require("fs");
const R = require("ramda");

const x = 0;
const y = 1;
const z = 2;

const sideLength = (p1, p2) =>
	Math.sqrt((p1[x] - p2[x])**2 + (p1[y] - p2[y])**2 + (p1[z] - p2[z])**2);

const triangleArea = ([pa, pb, pc]) => {
	// https://en.wikipedia.org/wiki/Herons_formula
	const a = sideLength(pa, pb);
	const b = sideLength(pb, pc);
	const c = sideLength(pc, pa);
	const s = (a + b + c) / 2;

	return Math.sqrt(s*(s-a)*(s-b)*(s-c));
};

R.compose(
	console.log.bind(console),
	tris => {
		// Get the footprint of the model, in mm^2
		const footprint = R.compose(
			R.sum,
			R.map(triangleArea),
			R.filter(R.all(p => p[z] === 0))
		)(tris);

		// Get the height of the model, in mm
		const height = R.compose(
			R.reduce(Math.max, -Infinity),
			R.flatten,
			R.map(R.map(p => p[z]))
		)(tris);

		// Calculate the volume. Divide by 1000 to convert from mm^3 to ml
		return (footprint * height) / 1000;
	},
	R.map(R.splitEvery(3)),
	R.map(R.map(Number)),
	R.map(R.split(",")),
	R.split("\n"),
	R.trim,
)(fs.readFileSync("input.txt", "utf-8"));

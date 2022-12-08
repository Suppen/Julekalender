import { readFileSync } from "fs";
import ch from "convex-hull";

const points = readFileSync("data.txt", "utf-8")
	.split("\n")
	.map(l => l.split(" "))
	.map(([x, y]) => [Number(x), Number(y)]);

const ps = ch(points).map(([i, _]) => points[i]);

const pyth = (p1, p2) => Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));

const herons = (p1, p2, p3) => {
	const a = pyth(p1, p2);
	const b = pyth(p2, p3);
	const c = pyth(p3, p1);
	const s = (a + b + c) / 2;

	return Math.sqrt(s * (s - a) * (s - b) * (s - c));
};

const totalArea = ([p1, ...ps]) => {
	let area = 0;
	for (let i = 0; i < ps.length - 1; i++) {
		area += herons(p1, ps[i], ps[i + 1]);
	}
	return area;
};

console.log(Math.round(totalArea(ps)));

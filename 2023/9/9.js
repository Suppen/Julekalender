import { readFileSync } from "fs";

// Parse the input
const raw = readFileSync("./rekke.txt", "utf-8");
console.time("solve");
const rekke = raw
	.slice(2, -2)
	.split("), (")
	.map(line => line.split(", ").map(s => Number.parseInt(s)));

// Make a map from elf numbers to their neighbours
const m = rekke.reduce((m, [a, b]) => {
	m.set(a, (m.get(a) ?? new Set()).add(b));
	m.set(b, (m.get(b) ?? new Set()).add(a));

	return m;
}, new Map());

const queue = [];
const [first, last] = [...m.entries()].filter(([_, v]) => v.size === 1).map(([k, _]) => k);
let current = first;
while (current !== last) {
	queue.push(current);
	const neighbours = [...m.get(current).values()];
	if (neighbours.length === 1) {
		current = neighbours[0];
	} else {
		current = neighbours.find(n => n !== queue[queue.length - 2]);
	}
}
queue.push(last);

const answer = queue[queue.length/2 - 1] + queue[queue.length/2];

console.timeEnd("solve");
console.log(answer);

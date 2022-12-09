import { readFileSync } from "fs";

const produce = (temp, water, co2) => {
	const w = water - 100;
	const c = Math.floor(co2 / 10);

	const l = w + c;

	const evaporated = Math.floor((temp >= 100 ? 1 / 40 : 0) * l);

	return l - evaporated;
};

const production = readFileSync("julebrusmaskiner.txt", "utf-8")
	.split("\n")
	.map(l => l.split(", "))
	.map(([name, temp, water, co2]) => {
		const regex = /\d+/;

		return {
			name: name.split(" ").slice(1).join(" "),
			temp: Number(temp.match(regex)[0]),
			water: Number(water.match(regex)[0]),
			co2: Number(co2.match(regex)[0])
		};
	})
	.reduce((production, { name, temp, water, co2 }) => {
		const tempRight = temp >= 95 && temp <= 105;
		const waterRight = water >= 400 && water <= 1500;
		const co2Right = co2 >= 300 && co2 <= 500;

		if (tempRight && waterRight && co2Right) {
			const alreadyProduced = production.get(name) ?? 0;

			production.set(name, alreadyProduced + produce(temp, water, co2));
		}

		return production;
	}, new Map());

const total = [...production.values()].reduce((sum, prod) => sum + prod, 0);
const most = [...production.entries()].reduce((most, machine) => (machine[1] > most[1] ? machine : most));

console.log(`${total} ${most[0]}`);

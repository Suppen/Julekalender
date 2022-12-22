import { readFileSync } from "fs";

export const parseExchange = str => {
	const [header, ...table] = str
		.split("\n")
		.slice(0, -1)
		.map(l =>
			l
				.split(",")
				.slice(0, -1)
				.map(c => c.trim())
		);

	const exchange = {};
	for (const row of table) {
		const rates = {};
		for (let i = 1; i < header.length; i++) {
			if (row[i] !== "x") {
				rates[header[i]] = Number(row[i]);
			}
		}
		exchange[row[0]] = rates;
	}

	exchange.NOKK = exchange.NOK;

	return exchange;
};

export const parseExchangeFile = fileName => parseExchange(readFileSync(fileName, "utf-8"));

export const dfs = (exchange, start, stop) => {
	const realDfs = (current, path) => {
		const pathHere = [...path, current];

		if (current === stop) {
			return pathHere;
		}

		const unvisitedNeighbours = Object.keys(exchange[current]).filter(c => !path.includes(c));

		return unvisitedNeighbours.map(neighbour => realDfs(neighbour, pathHere));
	};

	const flatPaths = [];
	const flattenPaths = arr => {
		if (typeof arr[0] === "string") {
			flatPaths.push(arr);
		} else {
			arr.forEach(flattenPaths);
		}
	};
	flattenPaths(realDfs(start, []));

	return flatPaths;
};

export const pathValue = (exchange, path) => {
	let value = 1;

	for (let i = 0; i < path.length - 1; i++) {
		value *= exchange[path[i]][path[i + 1]];
	}

	return value;
};

const exchange = parseExchangeFile("exchange.csv");
const multiplier = dfs(exchange, "NOKK", "NOK")
	.map(path => [path.length, pathValue(exchange, path)])
	.filter(([_, val]) => val > 1)
	.reduce((shortest, current) => (current[0] < shortest[0] ? current : shortest))[1];

const answer = Math.floor(multiplier * 100000) / 100;

console.log(answer);

// FULL DISCLOSURE: This file is made entirely by Claude AI

import fs from 'fs';

// Parse input file
function parseInput(filename) {
	const content = fs.readFileSync(filename, 'utf-8');
	const lines = content.trim().split('\n');
	const gifts = [];

	for (const line of lines) {
		const parts = line.split(', ');
		if (parts.length === 3) {
			const name = parts[0].replace('Gave ', '');
			const shape = parts[1];
			const weight = parseInt(parts[2]);
			gifts.push({ name, shape, weight });
		}
	}

	return gifts;
}

// Check if a gift can be placed on top of another
function canPlaceOn(topGift, bottomGift) {
	if (!bottomGift) return true; // Can always place on empty stack

	// Heavier gift cannot be on top of lighter gift
	if (topGift.weight > bottomGift.weight) return false;

	// Round or cylinder cannot be on top of round or cylinder
	const roundOrCylinder = ['rund', 'sylinder'];
	if (roundOrCylinder.includes(topGift.shape) && roundOrCylinder.includes(bottomGift.shape)) {
		return false;
	}

	return true;
}

// Check if gifts can be carried together
function canCarryTogether(gifts) {
	if (gifts.length === 0 || gifts.length > 3) return false;

	// Total weight must be <= 10kg
	const totalWeight = gifts.reduce((sum, g) => sum + g.weight, 0);
	if (totalWeight > 10) return false;

	// Check if round/cylinder are stacked on each other in the carry
	const roundOrCylinder = ['rund', 'sylinder'];
	for (let i = 1; i < gifts.length; i++) {
		if (roundOrCylinder.includes(gifts[i].shape) && roundOrCylinder.includes(gifts[i - 1].shape)) {
			return false;
		}
	}

	return true;
}

// Check if a group of gifts can be placed on a station's top
function canPlaceGroup(gifts, station) {
	if (station.length === 0) return true;

	const topOfStation = station[station.length - 1];
	return canPlaceOn(gifts[0], topOfStation);
}

// Get state as string for visited tracking
function stateToString(stations) {
	return stations.map(s => s.map(g => g.name).join('')).join('|');
}

// BFS to find solution
function solve(gifts) {
	// Initial state: all gifts at station 0
	const initialStations = [gifts.slice(), [], [], [], []];

	const queue = [{ stations: initialStations, moves: [] }];
	const visited = new Set();
	visited.add(stateToString(initialStations));

	while (queue.length > 0) {
		const { stations, moves } = queue.shift();

		// Check if solved (all gifts at station 4)
		if (stations[4].length === gifts.length) {
			return moves;
		}

		// Try all possible moves
		for (let from = 0; from < 5; from++) {
			if (stations[from].length === 0) continue;

			// Try taking 1, 2, or 3 gifts from top
			for (let count = 1; count <= Math.min(3, stations[from].length); count++) {
				const taken = stations[from].slice(-count);

				// Check if we can carry these gifts
				if (!canCarryTogether(taken)) continue;

				// Try placing on each station
				for (let to = 0; to < 5; to++) {
					if (from === to) continue;

					// Check if we can place this group on the destination
					if (!canPlaceGroup(taken, stations[to])) continue;

					// Create new state
					const newStations = stations.map(s => s.slice());
					newStations[from] = newStations[from].slice(0, -count);
					newStations[to] = newStations[to].concat(taken);

					const stateStr = stateToString(newStations);
					if (visited.has(stateStr)) continue;

					visited.add(stateStr);

					const moveStr = `[${taken.map(g => g.name).join(',')}] ${from} > ${to}`;
					queue.push({
						stations: newStations,
						moves: moves.concat([moveStr])
					});
				}
			}
		}
	}

	return null; // No solution found
}

// Main
const gifts = parseInput('input.txt');
console.log('Gaver:');
gifts.forEach(g => console.log(`  ${g.name}: ${g.shape}, ${g.weight}kg`));
console.log();

const solution = solve(gifts);

if (solution) {
	console.log('Løsning:');
	console.log(solution.join('. ') + '.');
	console.log();
	console.log(`Antall trekk: ${solution.length}`);
} else {
	console.log('Ingen løsning funnet!');
}

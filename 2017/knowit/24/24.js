"use strict";

/**************************
 * Import important stuff *
 **************************/

const fs = require("fs");

/************
 * Solve it *
 ************/

// Start a timer
console.time("Solved");

// Size of the board
const n = 10000;

/**
 * A portal in a graph
 */
class Portal {
	/**
	 * Creates a new portal
	 *
	 * @param {Object} from	Coordinates to the entrance of the portal
	 * @param {Object} to	Coordinates to the exit of the portal
	 */
	constructor(from, to) {
		this.from = from;
		this.to = to;
		this.neighbours = [];
	}
}

// Read the portal list
const portals = fs.readFileSync("portals.txt", "utf-8")
  // Remove trailing newline
  .trim()
  // Turn it into a CSV
  .replace(/->/g, ",")
  .replace(/\(|\)| /g, "")
  // Split into individual lines
  .split("\n")
  // Split into individual coordinates
  .map((line) => line.split(","))
  // Turn all coordinates into numbers
  .map((line) => line.map((coord) => Number.parseInt(coord)))
  // Create each portal
  .map(([fromX, fromY, toX, toY]) => new Portal({x: fromX, y: fromY}, {x: toX, y: toY}));

// Add dummy portals for start and end
const start = new Portal({x: -Infinity, y: -Infinity}, {x: 0, y: 0});
const end = new Portal({x: n-1, y: n-1}, {x: Infinity, y: Infinity});
portals.push(start);
portals.push(end);

// Calculate the manhattan distances between portal exits and all other portal entrances
portals.forEach((exit, i, portals) => {
	portals.forEach((entrance) => {
		exit.neighbours.push({
			portal: entrance,
			distance: Math.abs(exit.to.x - entrance.from.x) + Math.abs(exit.to.y - entrance.from.y)
		});
	});
});

/**
 * Calculates the length of the shortest path between a start portal and an end portal using Dijkstra's algorithm
 *
 * @param {Portal[]} portals	All portals in the graph
 * @param {Portal} start	The portal to start on
 * @param {Portal} end	The portal to end with
 *
 * @returns {Integer}	The distance between start and end
 */
function dijkstra(portals, start, end) {
	// Mark all portals as undiscovered
	const undiscoveredPortals = new Set(portals);

	// All portals have a distance of infinity to the start portal
	const distances = new Map(portals.map((portal) => [portal, Infinity]));
	// ...except the start portal, which has a distance of 0
	distances.set(start, 0);

	// Keep track of which portal is currently being worked on
	let currentPortal = start;

	// Process the graph until the end portal is reached
	while (currentPortal !== end) {
		// Mark this portal as discovered
		undiscoveredPortals.delete(currentPortal);

		// Get the distance to this node
		const distanceToStart = distances.get(currentPortal);

		// Calculate the distance from start to all neighbours through this node
		currentPortal.neighbours.forEach(({portal, distance}) => {
			// Get the current distance to this neighbour
			const currentDistance = distances.get(portal);

			// Calculate the new distance
			const newDistance = distanceToStart + distance;

			// Use the shortest distance
			if (newDistance < currentDistance) {
				distances.set(portal, newDistance);
			}
		});

		// Find the undiscovered portal which is closest to start
		let closestPortal = null;
		let closestDistance = Infinity;
		for (const portal of undiscoveredPortals) {
			const distance = distances.get(portal);
			if (distance < closestDistance) {
				closestPortal = portal;
				closestDistance = distance;
			}
		}

		// The closest portal is now the current portal
		currentPortal = closestPortal;
	}

	return distances.get(end);
}

// Calculate the distance between start and end
const distance = dijkstra(portals, start, end);

// Solved!
console.timeEnd("Solved");
console.log(distance);

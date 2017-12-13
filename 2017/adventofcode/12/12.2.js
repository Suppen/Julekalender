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

// Read and process the file
const graph = fs.readFileSync("input.txt", "utf-8")
  .trim()	// Remove trailing newline
  .replace(/(<|-|>|,)/g, "")	// Get rid of extra characters
  .split("\n")	// Split into individual lines
  .map((line) => line.split(/\s+/).map((num) => Number.parseInt(num)))	// Split into individual numbers
  .reduce((graph, [id, ...connectsTo]) => {graph.set(id, connectsTo); return graph;}, new Map());

/**
 * Finds all cells which are possible to reach from a start position in a maze
 *
 * @param {Integer} id	ID of the node
 * @param {Integer[]} graph	The graph to search
 * @param {Set} discovered	Set of discovered nodes
 *
 * @returns {Set}	The set of nodes reachable from the starting position
 */
function dfs(id, graph, discovered = new Set()) {
        // Ignore this cell if it has already been discovered
        if (discovered.has(id)) {
                return;
        }

        // Mark this node as discovered
        discovered.add(id);

        // Recursively search the neighbour paths
	graph.get(id).forEach((id) => dfs(id, graph, discovered));

        return discovered;
}

// Geep track of number of groups
let groups = 0;

// Discover the groups
while (graph.size > 0) {
	// Get some ID from the map
	const startId = graph.keys().next().value;

	// Find all nodes connected to the start node
	const connected = dfs(startId, graph);

	// Remove the connected ones from the map
	for (const id of connected) {
		graph.delete(id);
	}

	// This was a group
	groups++;
}

// Solved!
console.timeEnd("Solved");
console.log(groups);

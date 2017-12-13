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
  .reduce((graph, [id, ...connectsTo]) => {graph[id] = connectsTo; return graph;}, []);

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
	graph[id].forEach((id) => dfs(id, graph, discovered));

        return discovered;
}

// Find how many nodes are reachable from 0
const solution = dfs(0, graph).size;

// Solved!
console.timeEnd("Solved");
console.log(solution);

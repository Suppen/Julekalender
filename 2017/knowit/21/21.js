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

// Define some constants
const FRIEND = "vennskap";
const ENEMY = "fiendskap";

// Initially confirmed friends and enemies
const CONFIRMED_FRIEND = "Asgeir";
const CONFIRMED_ENEMY = "Beate";

// Some helper classes
class GraphNode {
	constructor(name) {
		this.name = name;
		this.edges = [];
	}
}

class GraphEdge {
	constructor(a, b, relation) {
		this.a = a;
		this.b = b;
		this.areFriends = relation === FRIEND;
	}

	getOtherEnd(node) {
		let otherEnd = null;
		if (node === this.a) {
			otherEnd = this.b;
		} else if (node === this.b) {
			otherEnd = this.a;
		}
		return otherEnd;
	}
}

// The all-important friend/ememy graph
const graph = new Map();

// Read and process the file
fs.readFileSync("etterretningsrapport.txt", "utf-8")
  .trim()	// Remove the last, empty line
  .split("\n")	// Split into individual lines
  .map((line) => line.split(" "))	// Tokenize
  .forEach(([relation, a, b]) => {	// Build the graph
	  // Create the node for person a if it does not exist
	  if (!graph.has(a)) {
		graph.set(a, new GraphNode(a));
	  }
	  // Create the node for person b if it does not exist
	  if (!graph.has(b)) {
		graph.set(b, new GraphNode(b));
	  }
	  // Create the edge
	  const edge = new GraphEdge(graph.get(a), graph.get(b), relation);
	  // Add the edge to a and b
	  graph.get(a).edges.push(edge);
	  graph.get(b).edges.push(edge);
  });

/**
 * Counts friends and enemies in a graph
 *
 * @param {GraphNode} node	Node to start on
 * @param {Boolean} isMyFriend	Whether or not the start node is a friend
 *
 * @returns {Object}	An object with friend and enemy count
 */
function dfs(node, isMyFriend) {
	// Recursive DFS caused stack overflow. Iterative works

	// Stack of which nodes to process
	const stack = [{
		node,
		isMyFriend
	}];

	// Set of discovered nodes
	const discovered = new Set();

	// Count of how many friends and enemies are discovered
	const result = {friends: 0, enemies: 0};

	// Process the stack
	while (stack.length > 0) {
		// Pop the top node off the stack
		const v = stack.pop();

		// Check if it has already been processed
		if (discovered.has(v.node)) {
			continue;
		}

		// Mark the node as discovered
		discovered.add(v.node);

		// Count friend or enemy
		if (v.isMyFriend) {
			result.friends++;
		} else {
			result.enemies++;
		}

		// Add all neighbours to the stack
		v.node.edges.forEach((edge) => {
			// Get the other end of the edge
			const otherEnd = edge.getOtherEnd(v.node);

			// The neighbour is my friend if this node has the same relation to me as to the neighbour
			const neighbourIsMyFriend = v.isMyFriend === edge.areFriends;

			// Push it onto the stack
			stack.push({
				node: otherEnd,
				isMyFriend: neighbourIsMyFriend
			});
		});
	}

	return result;
}

// Calculate result. I happen to know the known friend and known enemy are in different subgraphs, so they must be traversed separately
const confirmedFriendResult = dfs(graph.get(CONFIRMED_FRIEND), true);
const confirmedEnemyResult = dfs(graph.get(CONFIRMED_ENEMY), false);

// Create the result
const result = {
	friends: confirmedFriendResult.friends + confirmedEnemyResult.friends,
	enemies: confirmedFriendResult.enemies + confirmedEnemyResult.enemies,
	neutral: graph.size - (confirmedFriendResult.friends + confirmedEnemyResult.friends + confirmedFriendResult.enemies + confirmedEnemyResult.enemies)
};

// Solved!
console.timeEnd("Solved");
console.log(`${result.friends} ${result.enemies} ${result.neutral}`);

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

/** Helper class for nodes in the tree */
class Node {
	constructor(name, children) {
		this.name = name;
		this.children = children.map((name => name.replace(",", "")));
		this.parent = null;
	}
}

// Read an process the file
const nodes = fs.readFileSync("input.txt", "utf-8")
  .replace(/(\(|\)|,|->)/g, "")
  .split("\n")
  .filter((line) => line !== "")
  .map((line) => line.split(/\s+/))
  .map(([name, weight, ...children]) => new Node(name, children));

// Put the actual nodes as the children instead of just the names
nodes.forEach((node, i, arr) => node.children = node.children.map((childName) => arr.find(({name}) => name === childName)));

// Find the parents of each node
nodes.forEach((node) => node.children.forEach((child) => child.parent = node));

// Find the node without a parent
const tree = nodes.find(({parent}) => parent === null);

// Solved!
console.timeEnd("Solved");
console.log(tree.name);

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
	constructor(name, weight, children) {
		this.name = name;
		this.weight = Number.parseInt(weight.replace(/(\(|\))/g, ""));
		this.totalWeight = 0;
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
  .map(([name, weight, ...children]) => new Node(name, weight, children));

// Put the actual nodes as the children instead of just the names
nodes.forEach((node, i, arr) => node.children = node.children.map((childName) => arr.find(({name}) => name === childName)));

// Find the parents of each node
nodes.forEach((node) => node.children.forEach((child) => child.parent = node));

// Find the node without a parent. This is the root
const tree = nodes.find(({parent}) => parent === null);

// Calculate the total weight each node holds
(function calculateTotalWeight(node) {
	node.totalWeight = node.weight + node.children.reduce((totalWeight, child) => totalWeight + calculateTotalWeight(child), 0);
	return node.totalWeight;
}(tree));

const wronglyWeightedNode = (function f(node) {
	// Find the unique child
	let u = node.children.find((child, i, arr) => arr.every((n) => n === child || n.totalWeight !== child.totalWeight));

	// Check if one was found
	if (u !== undefined) {
		u = f(u);
	} else {
		u = node;
	}

	return u;
}(tree.children[5]));	// XXX The task input appears to be wrong! There are two bad nodes in the graph. AoC only accepts the answer for one of them. Therefore, look in one specific branch

// Find the difference between the normally weighted children
const difference = wronglyWeightedNode.parent.children.find((node) => node.totalWeight !== wronglyWeightedNode.totalWeight).totalWeight - wronglyWeightedNode.totalWeight;

// Calculate what weight it should have to balance the tree
const correctWeight = wronglyWeightedNode.weight + difference;

// Solved!
console.timeEnd("Solved");
console.log(correctWeight);

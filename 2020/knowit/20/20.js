"use strict";

const fs = require("fs");

class Node {
	constructor(name) {
		this.name = name;
		this.underlings = new Map();
	}

	processUnderlings([underlingName, ...chain]) {
		const underlingNode = this.underlings.get(underlingName);

		if (underlingNode === undefined) {
			if (chain.length === 0) {
				// This is a new node
				const node = new Node(underlingName);
				this.underlings.set(underlingName, node);
			} else {
				// This elf has not previously been seen, but has underlings. It is fired or retired. Move the next underling one step up the chain
				this.processUnderlings(chain);
			}
		} else {
			underlingNode.processUnderlings(chain);
		}

		return this;
	}

	get isWorker() {
		return this.underlings.size === 0;
	}

	get isManager() {
		return !this.isWorker;
	}

	prune() {
		if (this.underlings.size === 1) {
			const [underling] = this.underlings.values();
			if (underling.isManager) {
				// This elf is unnecessary. Remove it
				this.name = underling.name;
				this.underlings = underling.underlings;
			}
		}

		[...this.underlings.values()].forEach(u => u.prune());

		return this;
	}

	census() {
		if (this.isWorker) {
			return { workers: 1, managers: 0 };
		} else {
			return [...this.underlings.values()]
				.map(u => u.census())
				.reduce(
					({ workers: totalWorkers, managers: totalManagers }, { workers, managers }) => (
						{
							workers: totalWorkers + workers,
							managers: totalManagers + managers
						}
					),
					{ workers: 0, managers: 1 }
				);
		}
	}
}

//*
const elves = fs
	// Read the file
	.readFileSync("elves.txt", "utf-8")
/*/
const elves = `Athena
Demeter
Hades
Hades🎄Hypnos
Athena🎄Icarus
Hades🎄Nyx🎄Zagreus🎄Medusa
Athena🎄Orpheus
Athena🎄Icarus🎄Poseidon🎄Cerberus
Hades🎄Nyx🎄Zagreus
Athena🎄Icarus🎄Poseidon`
/*/
	// Split it into lines
	.split("\n")
	// Remove the last, empty line
	.slice(0, -1)
	// Split the lines into lists of names
	.map(l => l.split("🎄"))
	// Sort the lines according to number of names on them
	.sort(({ length: a }, { length: b }) => a - b)
	// Build the tree!
	.reduce((tree, names) => tree.processUnderlings(names), new Node("Julenissen"))
	// Prune unnecessary middle managers
	.prune()
	.prune()
	.prune()
	// Count workers and managers
	.census();

console.log(elves.workers - (elves.managers - 1));

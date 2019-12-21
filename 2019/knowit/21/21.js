"use strict";

const R = require("ramda");
const fs = require("fs");

const process = (m, genNumber, gen0Size, [genN, genNp1, ...gens]) => R.compose(
	R.ifElse(
		// If there are none
		R.isEmpty,
		// then process the next generation
		() => process(m, genNumber+1, gen0Size, [genNp1, ...gens]),
		// Else find the lowest numbered common ancestor elf in this generation
		R.compose(
			i => `${genNumber}:${i}`,
			R.reduce(R.min, Infinity),
			R.map(elf => R.findIndex(R.equals(elf), genNp1)),
			R.map(R.head)
		)
	),
	// Find the parents which are now related to all elves in gen0
	R.filter(([elf, relatedTo]) => R.equals(gen0Size, relatedTo.size)),
	R.unnest,
	// Find out who in gen0 the parent generation is related to
	R.map(elf => {
		// Get the list of the gen0 elves this elf is related to
		const relatedTo = R.defaultTo(new Set(), m.get(elf));

		// Get this elfs parents
		const p1 = genNp1[elf[0]];
		const p2 = genNp1[elf[1]];

		// Union this elf's relations into the parents' relations
		const p1RelatedTo = R.defaultTo(new Set(), m.get(p1));
		const p2RelatedTo = R.defaultTo(new Set(), m.get(p2));

		for (const r of relatedTo) {
			p1RelatedTo.add(r);
			p2RelatedTo.add(r);
		}

		// Shove it back into the map
		m.set(p1, p1RelatedTo);
		m.set(p2, p2RelatedTo);

		// Remove this elf from the map
		m.delete(elf);

		// Return the relations
		return [[p1, p1RelatedTo], [p2, p2RelatedTo]];
	})
)(genN);

R.compose(
	console.log.bind(console),
	// Process the generations
	([m, gen0Size, gens]) => process(m, 1, gen0Size, gens),
	// Make a map of which elves in gen0 each elf is related to
	([gen0, ...gens]) => [
		new Map(R.zip(gen0, R.map(n => new Set([n]), R.range(0, R.length(gen0))))),
		R.length(gen0),
		[gen0, ...gens]
	],
	// Remove all even-numbered elves in generation 0
	R.adjust(0, R.compose(
		R.map(([n, elf]) => elf),
		R.filter(([n, elf]) => n % 2 == 1),
		elves => R.zip(R.range(0, R.length(elves)), elves)
	)),
	// Parse the file into a 2D array of generations and elves, arr[gen][elfNo]
	R.map(R.map(R.map(Number))),
	R.map(R.map(R.split(","))),
	R.map(R.split("\;")),
	R.split("\n"),
	R.trim
)(fs.readFileSync("generations.txt", "utf-8"));

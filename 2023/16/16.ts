import { readFileSync } from "fs";

type Elf = {
	seniority: number;
	bonus: number;
};

const rekke: [Elf] = JSON.parse(readFileSync("rekke.txt", "utf-8")).map((seniority: number) => ({
	seniority,
	bonus: 1
}));

const isHappy = (i: number, rekke: [Elf]): boolean => {
	const thisElf = rekke[i];

	// Define relative positions of this elf
	const isUnhappy = [-2, -1, 1, 2]
		// Get the elves at those positions
		.map(n => rekke[i + n])
		// Filter out those past the ends of the array
		.filter(n => n !== undefined)
		// Check if any of them are better off
		.some(otherElf => {
			// A neighbour with the same seniority and higher bonus is better off
			if (otherElf.seniority === thisElf.seniority && otherElf.bonus > thisElf.bonus) {
				return true;
			}

			// A neighbour with lower seniority and the same or higher bonus is better off
			if (otherElf.seniority < thisElf.seniority && otherElf.bonus >= thisElf.bonus) {
				return true;
			}

			return false;
		});

	return !isUnhappy;
}

let didChange: boolean;
do {
	const unhappyIndices: number[] = [];

	// Find the unhappy elves
	for (let i = 0; i < rekke.length; i++) {
		if (!isHappy(i, rekke)) {
			unhappyIndices.push(i);
		}
	}

	// Give the unhappy elves a bonus
	unhappyIndices.forEach(i => rekke[i].bonus++);

	didChange = unhappyIndices.length > 0;
} while (didChange);

console.log(rekke.reduce((acc, elf) => acc + elf.bonus, 0));

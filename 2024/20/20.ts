import fs from "node:fs";

type Elf = { name: string, height: number };

const elves: Elf[] =
	fs.readFileSync("usorterte_alver.txt", "utf8")
		.split("\n")
		.filter((l: string) => l.length > 0)
		.map((l: string) => l.split(" "))
		.map(([name, height]) => ({ name, height: parseInt(height) }));

const partySortElves = (elves: Elf[]): [Elf["name"], number] => {
	const partyElfMap = new Map<Elf["name"], number>();

	let swaps = 0;

	const party = (i: number) => {
		const partyElves = elves.slice(i, i + 5);

		for (const partyElf of partyElves) {
			let parties = (partyElfMap.get(partyElf.name) ?? 0) + 1;
			partyElfMap.set(partyElf.name, parties);
		}

		partyElves.reverse();

		elves.splice(i, partyElves.length, ...partyElves);
	};

	let i = 0.5;
	while (i < elves.length - 1) {
		const inFront = Math.ceil(i);
		const behind = Math.floor(i);
		if (i > 0 && elves[inFront].height < elves[behind].height) {
			const temp = elves[behind];
			elves[behind] = elves[inFront];
			elves[inFront] = temp;
			swaps++;

			if (swaps === 7) {
				party(inFront); // and business in the back?
				swaps = 0;
			}

			i = i - 1;
		} else {
			i = i + 1;
		}
	}

	return [...partyElfMap.entries()].reduce((mostParties, current) => {
		if (current[1] > mostParties[1]) {
			return current;
		} else {
			return mostParties;
		}
	});
}

const [bestPartyElf, parties] = partySortElves(elves);

console.log(`${bestPartyElf},${parties}`);

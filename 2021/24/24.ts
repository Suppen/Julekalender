import * as fs from "fs";

//*
const feilregistreringer = fs.readFileSync("feilregistreringer.txt", "utf-8")
/*/
const feilregistreringer =
`🌟Nissing🌟 / 1 / 1 / 1 / 1 / 1 / 1 / 1
Pakkepakker / 5 / 10 / 15 / 20 / 25 / 30 / 35
Lekeinspektør / 6 / 11 / 16 / 21 / 26 / 31 / 36
Skøytesliper / 7 / 12 / 17 / 22 / 27 / 32 / 37
`
//*/
	.split("\n")
	.slice(0, -1)
	.map(line => line.split(/\s*\/\s*/))
	.map(([job, ...steps]) => [job, steps.map(Number)] as const)
	.reduce((m, [job, misregistrations]) => {
		m.set(job, misregistrations);
		return m;
	}, new Map<string, number[]>());

//*
const skritt = fs.readFileSync("skritt.txt", "utf-8")
/*/
const skritt =
`Nissen 🎅 / 🌟Nissing🌟 / 2000 / 2000 / 3000 / 4000 / / 5000 /
Sneglulf / Pakkepakker / / 100 / 100 / 100 / 100 / / 100
Alvulf / Lekeinspektør / 50 / 50 / 50 / 50 / 50 / 50 / 50
##
Nissen 🎅 / 🌟Nissing🌟 / / 100 / / / 1000 / / 1000
Sneglulf / Skøytesliper / 30 / / / 30 / 30 / / 30
Alvulf / Lekeinspektør / 30 / 30 / 30 / / 30 / 30 /
`
//*/
	.split("\n")
	.slice(0, -1)
	.filter(line => line !== "##")
	.map(line => line.split(/\s*\/\s*/))
	.map(([name, job, ...steps]) => [name, job, ...steps.map(Number)] as const)
	.reduce((weeks, [name, job, ...steps]) => {
		if (name === "Nissen 🎅") {
			weeks.push(new Map());
		}
		weeks[weeks.length - 1].set(name, { job, steps });
		return weeks;
	}, [] as Map<string, { job: string, steps: number[] }>[]);

const countStepsPerDay = (
	feilregistreringer: Map<string, number[]>,
	skritt: Map<string, { job: string, steps: number[] }>[]
): Map<string, number[]> => {
	const totalSteps = new Map<string, number[]>();

	for (const week of skritt) {
		for (const [name, { job, steps }] of week) {
			const misregistrations = feilregistreringer.get(job);

			const ts = totalSteps.get(name) ?? Array(7).fill(0);

			for (let dayNumber = 0; dayNumber < ts.length; dayNumber++) {
				ts[dayNumber] += Math.max(0, steps[dayNumber] - misregistrations[dayNumber]);
			}

			totalSteps.set(name, ts);
		}
	}

	return totalSteps;
};

const solve = (stepsPerDay: Map<string, number[]>) => {
	const santaSteps = Array(7).fill(0);
	const nonSantaSteps = Array(7).fill(0);
	let elfCount = 0;

	for (const [name, steps] of stepsPerDay) {
		const isSanta = name === "Nissen 🎅";
		const stepArray = isSanta ? santaSteps : nonSantaSteps;
		if (!isSanta) {
			elfCount++;
		}

		for (let dayNumber = 0; dayNumber < steps.length; dayNumber++) {
			stepArray[dayNumber] += steps[dayNumber];
		}
	}

	const santaDeltas = [...santaSteps];
	for (let dayNumber = 0; dayNumber < santaSteps.length; dayNumber++) {
		santaDeltas[dayNumber] -= nonSantaSteps[dayNumber] / elfCount;
	}

	return santaDeltas.map(steps => Math.floor(steps / 4)).join("");
};

console.log(solve(countStepsPerDay(feilregistreringer, skritt)));

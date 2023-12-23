import { readFileSync } from "fs";

type Point = [number, number]; // [y, x]
const dirs = ["N", "E", "S", "W"] as const;
type Directions = (typeof dirs)[number];
type Cannon = {
	readonly maxR: number;
	currentR: number;
	readonly minR: number
	readonly heating: number;
	readonly reload: number;
	timeSpent: number;
}

const points = readFileSync("gateadresser_oslo_koordinater_liten.txt", "utf-8")
	.split("\n")
	.filter(l => l.length > 0)
	.map(l => l
		 .split(" ")
		 .map(Number)
		 // Do everything in meters, not degrees
		 .map(n => n * 55_500) as Point
	);

const northernmost = (points: Point[]): Point[] => points.reduce((acc, p) => {
	if (p[0] > acc[0][0]) {
		return [p];
	} else if (p[0] === acc[0][0]) {
		acc.push(p);
		return acc;
	} else {
		return acc;
	}
}, [[-Infinity, 0]]);
const southernmost = (points: Point[]): Point[] => points.reduce((acc, p) => {
	if (p[0] < acc[0][0]) {
		return [p];
	} else if (p[0] === acc[0][0]) {
		acc.push(p);
		return acc;
	} else {
		return acc;
	}
}, [[Infinity, 0]]);
const easternmost = (points: Point[]): Point[] => points.reduce((acc, p) => {
	if (p[1] > acc[0][1]) {
		return [p];
	} else if (p[1] === acc[0][1]) {
		acc.push(p);
		return acc;
	} else {
		return acc;
	}
}, [[0, -Infinity]]);
const westernmost = (points: Point[]): Point[] => points.reduce((acc, p) => {
	if (p[1] < acc[0][1]) {
		return [p];
	} else if (p[1] === acc[0][1]) {
		acc.push(p);
		return acc;
	} else {
		return acc;
	}
}, [[0, Infinity]]);

const dirToPointGetter: { [key in Directions]: (points: Point[]) => Point[] } = {
	N: northernmost,
	E: easternmost,
	S: southernmost,
	W: westernmost,
};

const newMode1Cannon = (): Cannon => ({
	maxR: 2_000,
	currentR: 2_000,
	minR: 2_000 * 20 / 100,
	heating: 10/100,
	reload: 62,
	timeSpent: 0,
});

const newMode2Cannon = (): Cannon => ({
	maxR: 1_000,
	currentR: 1_000,
	minR: 1_000 * 20 / 100,
	heating: 5/100,
	reload: 22,
	timeSpent: 0,
});

const newMode3Cannon = (): Cannon => ( {
	maxR: 500,
	currentR: 500,
	minR: 500 * 20 / 100,
	heating: 0.2/100,
	reload: 16,
	timeSpent: 0,
});

const fireCannon = (cannon: Cannon, target: Point, points: Point[]): {
	cannon: Cannon;
	remainingPoints: Point[];
} => {
	// Remove all points in the blast radius
	const [x, y] = target;
	const remainingPoints = points.filter(p => {
		const [px, py] = p;
		const dx = px - x;
		const dy = py - y;
		const r = Math.sqrt(dx * dx + dy * dy);
		return r >= cannon.currentR;
	});

	// Heat up the cannon and reload
	//cannon.currentR = Math.max(cannon.minR, cannon.currentR * (1 - cannon.heating));
	cannon.currentR = Math.max(cannon.minR, cannon.currentR - (cannon.maxR * cannon.heating));
	cannon.timeSpent += cannon.reload;

	return { cannon, remainingPoints };
}

const strat1 = (cannon: Cannon, points: Point[]): number => {
	// Copy the points
	let ps = [...points];

	do {
		// Find the easternmost of the northernmost points
		const [p] = easternmost(northernmost(ps));

		// Fire at the point
		const { remainingPoints } = fireCannon(cannon, p, ps);
		ps = remainingPoints;
	} while (ps.length > 0);

	return cannon.timeSpent - cannon.reload;
};

const strat2 = (cannon: Cannon, points: Point[]): number => {
	// Copy the points
	let ps = [...points];

	// Current direction
	let di = dirs.indexOf("N");

	do {
		const d: Directions = dirs[di % dirs.length];
		const primary = dirToPointGetter[d];
		const secondary = dirToPointGetter[dirs[(di + 1) % dirs.length]];

		const [p] = secondary(primary(ps));

		// Fire at the point
		const { remainingPoints } = fireCannon(cannon, p, ps);
		ps = remainingPoints;

		// Choose the next direction
		di++;
	} while (ps.length > 0);

	return cannon.timeSpent - cannon.reload;
}

const strat3 = (cannon: Cannon, points: Point[]): number => {
	// Copy the points
	let ps = [...points];

	// Current direction
	let di = dirs.indexOf("N");

	do {
		if (di < 0) di += dirs.length;

		const primary = dirToPointGetter[dirs[di % dirs.length]];
		const secondary = dirToPointGetter[dirs[(di + 1) % dirs.length]];

		const [p] = secondary(primary(ps));

		// Fire at the point
		const { remainingPoints } = fireCannon(cannon, p, ps);
		ps = remainingPoints;

		// Choose the next direction
		if (ps.length % 5 === 0) {
			// Do not change direction
		} else if (ps.length % 2 === 0) {
			di--;
		} else {
			di++;
		}
	} while (ps.length > 0);

	return cannon.timeSpent - cannon.reload;
}

console.log("Mode 1, strat 1:", strat1(newMode1Cannon(), points));
console.log("Mode 1, strat 2:", strat2(newMode1Cannon(), points));
console.log("Mode 1, strat 3:", strat3(newMode1Cannon(), points));
console.log("Mode 2, strat 1:", strat1(newMode2Cannon(), points));
console.log("Mode 2, strat 2:", strat2(newMode2Cannon(), points));
console.log("Mode 2, strat 3:", strat3(newMode2Cannon(), points));
console.log("Mode 3, strat 1:", strat1(newMode3Cannon(), points));
console.log("Mode 3, strat 2:", strat2(newMode3Cannon(), points));
console.log("Mode 3, strat 3:", strat3(newMode3Cannon(), points));

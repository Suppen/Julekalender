"use strict";

const steps = 1000740;
//const steps = 400;

const primesArr = [2];
for (let n = 3; n <= steps; n += 2) {
	let isPrime = true;
	let i = 1;
	while (isPrime && primesArr[i] <= Math.sqrt(steps)) {
		if (n % primesArr[i++] === 0) {
			isPrime = false;
			break;
		}
	}
	if (isPrime) {
		primesArr.push(n);
	}
}
const primes = new Set(primesArr);

const debug = false;
const debugLog = (...args) => debug ? console.log(...args) : null;

const getNextElf = (elfNo, dir) => {
	if (dir === "cw") {
		elfNo += 1;
	} else {
		elfNo -= 1;
	}

	if (elfNo === 0) {
		elfNo = 5;
	} else if (elfNo === 6) {
		elfNo = 1;
	}

	return elfNo;
};

const solve = () => {
	let stepNo = 1;
	let elfNo = 1;
	let direction = "cw";
	let elves = [undefined, 0, 0, 0, 0, 0];

	while (stepNo <= steps) {
		elves[elfNo]++;
		debugLog(`#${stepNo} done by elf ${elfNo}. ${elves.slice(1)}`);

		let nextStep = stepNo+1;
		let nextElf = null;
		let nextDirection = direction;

		if (primes.has(nextStep)) {
			const fewest = elves.slice(1).reduce((a, b) => Math.min(a, b));
			const firstI = elves.indexOf(fewest);
			const lastI = elves.lastIndexOf(fewest);
			if (firstI === lastI) {
				nextElf = firstI;
				debugLog("Rule 1 triggered");
			} else {
				debugLog("Rule 1 failed");
			}
		}
		if (nextElf === null && nextStep % 28 === 0) {
			nextDirection = direction === "cw" ? "ccw" : "cw";
			nextElf = getNextElf(elfNo, nextDirection);
			debugLog("Rule 2 succeeded");
		}
		if (nextElf === null && nextStep % 2 === 0) {
			const most = elves.slice(1).reduce((a, b) => Math.max(a, b));
			const firstI = elves.indexOf(most);
			const lastI = elves.lastIndexOf(most);
			if (firstI === lastI && firstI === getNextElf(elfNo, direction)) {
				nextElf = getNextElf(getNextElf(elfNo, direction), direction);
				debugLog("Rule 3 succeeded");
			} else {
				debugLog("Rule 3 failed");
			}
		}
		if (nextElf === null && nextStep % 7 === 0) {
			nextElf = 5;
			debugLog("Rule 4 succeeded");
		}
		if (nextElf === null) {
			nextElf = getNextElf(elfNo, direction);
			debugLog("Rule 5 succeeded");
		}

		stepNo = nextStep;
		elfNo = nextElf;
		direction = nextDirection;
	}

	return elves;
};

const res = solve();
res.forEach((n, i) => i === 0 ? null : console.log(`${i}: ${n}`));

const most = res.slice(1).reduce((a, b) => Math.max(a, b));
const fewest = res.slice(1).reduce((a, b) => Math.min(a, b));
console.log(most - fewest);

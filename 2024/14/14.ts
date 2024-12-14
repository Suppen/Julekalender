const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
type Digit = (typeof digits)[number];

const remaining: [number, number, number, number, number, number, number, number, number, number] = digits.map(() => 100_000) as typeof remaining;

const usedUp: Digit[] = [];

let lines = 0;
while (Object.values(remaining).some(n => n > 0)) {
	for (const d of [...digits].reverse()) {
		for (const digit of `${Math.max(0, remaining[d])}${d}`.split("").map(Number)) {
			remaining[digit]--;
		}

		if (remaining[d] <= 0 && !usedUp.includes(d)) {
			usedUp.push(d);
		}
	}
	lines++;
}

console.log(`${lines} ${usedUp}`);

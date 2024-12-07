const knownHappyNumbers = new Set([0, 1]);
const knownSadNumbers = new Set<number>();

const toDigits = (n: number, base: number = 10): number[] => n.toString(base).split("").map(c => Number(c));
const fromDigits = (digits: number[], base: number = 10): number => digits.reduce((sum, num) => sum * base + num, 0);

const isHappy = (n: number, seenNumbers = new Set<number>()): boolean => {
	if (knownHappyNumbers.has(n)) {
		for (const happy of seenNumbers) {
			knownHappyNumbers.add(happy);
		}
		return true;
	}
	if (seenNumbers.has(n)) {
		for (const sad of seenNumbers) {
			knownSadNumbers.add(sad);
		}
		return false
	}

	seenNumbers.add(n);

	const squaredDigitSum = toDigits(n).map(d => d ** 2).reduce((sum, num) => sum + num, 0);

	return isHappy(squaredDigitSum, seenNumbers);
}

const isChristmasThreeNumber = (n: number): boolean => {
	if (!isHappy(n)) {
		return false;
	}

	const digits = toDigits(n);
	const halfLength = Math.floor(digits.length / 2);

	if (halfLength === 0) {
		return true;
	}

	const firstHalf = digits.slice(0, halfLength);
	const secondHalf = digits.slice(-halfLength);

	if (!isHappy(fromDigits(firstHalf)) || !isHappy(fromDigits(secondHalf))) {
		return false;
	}

	for (let i = 0; i < digits.length - 2; i++) {
		if (!isHappy(fromDigits(digits.slice(i, i + 3)))) {
			return false;
		}
	}

	return true;
}

let bestN: number | null = null;
for (let n = 10_000_000 - 1; bestN === null; n--) {
	if (isChristmasThreeNumber(n)) {
		bestN = n;
	}
}

console.log(bestN);

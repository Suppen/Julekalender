"use strict";

const magicNumber = 27644437;
const specialDividend = 5897;

const codeForDay = x => {
	let y;
	for (y = 2; y < magicNumber; y++) {
		const b = y * x;
		const r = b % magicNumber;
		if (r === 1) break;
	}

	const z = specialDividend * y;
	return z % magicNumber;
}

console.log(codeForDay(7));

"use strict";

const R = require("ramda");

const magicNumber = 27644437;
const specialDividend = 5897;

const codeForDayFunctional =
	x => R.compose(
		R.mathMod(R.__, magicNumber),
		R.multiply(specialDividend),
		R.find(
			R.compose(
				R.equals(1),
				R.mathMod(R.__, magicNumber),
				R.multiply(x)
			)
		)
	)(R.range(2, magicNumber));

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

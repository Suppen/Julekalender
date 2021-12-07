"use strict";

let antPos = 1;
let bandLength = 20;

while (antPos < bandLength) {
	const newBandLength = bandLength + 20;
	const stretchRatio = newBandLength / bandLength;
	antPos = antPos * stretchRatio + 1;
	bandLength = newBandLength;
}

console.log(bandLength / 100);

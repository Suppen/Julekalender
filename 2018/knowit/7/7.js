"use strict";

const fs = require("fs");

console.time("Solved");

fs.promises.readFile("input.txt", "utf-8")
	.then(res =>
		res.split("\n")
			.filter(line => line.trim() !== "")
			.map(Number)
	)
	.then(lnds)
	.then(res => console.log(res.length))
	.then(() => console.timeEnd("Solved"));

function lnds(X) {
	const P = new Array(X.length);
	const M = new Array(X.length+1);

	let L = 0;

	for (let i = 0; i < X.length-1; i++) {
		let lo = 1;
		let hi = L;

		while (lo <= hi) {
			const mid = Math.ceil((lo+hi)/2);
			if (X[M[mid]] <= X[i]) {
				lo = mid+1;
			} else {
				hi = mid-1;
			}
		}

		const newL = lo;

		P[i] = M[newL-1];
		M[newL] = i;

		if (newL > L) {
			L = newL;
		}
	}

	const S = new Array(L);
	let k = M[L];
	for (let i = L-1; i >= 0; i--) {
		S[i] = X[k]
		k = P[k];
	}

	return S;
}

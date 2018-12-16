"use strict";

const fs = require("fs");

const primes = [2];

for (let n = 3; n < 10000000; n += 2) {
	let isPrime = true;
	const s = Math.sqrt(n);
	for (let i = 0; isPrime && primes[i] <= s; i++) {
		isPrime = n % primes[i] !== 0;
	}

	if (isPrime) {
		primes.push(n);
	}
}

function isPrime(n) {
	let i = 0;
	while (primes[i] < n) {
		i++;
	}
	return primes[i] === n;
}

Promise.all([
	fs.promises.readFile("input.txt", "utf-8"),
	fs.promises.readFile("pals.txt", "utf-8")
])
	.then(([input, data]) => {
		input = input.replace(/(^|,|$)/g, "|");

		data = JSON.parse(data).map(n => Number.parseInt(n));

		let best = 2;
		for (let i = 1; i < data.length; i++) {
			if (data[i] < 10)
				continue;

			let str = input.slice(i-data[i], i+data[i]+1);
			str = removeBoundaries(str).map(n => Number.parseInt(n));
			do {
				const sum = str.reduce((sum, n) => sum+n, 0);
				if (sum > best) {
					if (isPrime(sum)) {
						best = sum;
					}
				} else {
					str = [0];
				}
				str = str.slice(1, str.length-1);
			} while (str.length > 0);
		}
		console.log(best);
	})
	.catch(err => console.error(err));


function removeBoundaries(str) {
	if (str.length<3)
	    return "";

	const str2 = new Array((str.length-1)/2)
	for (let i = 0; i < str2.length; i++) {
	    str2[i] = str[i*2+1];
	}
	return str2;
}

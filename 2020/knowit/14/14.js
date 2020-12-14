"use strict";

const erathostenes = n => {
	const primes = Array(n+1).fill(true);
	primes[0] = false;
	primes[1] = false;

	let k = 2;
	const sqrt = Math.sqrt(n);
	while (k <= sqrt) {
		for (let i = 2; i*k <= n; i++) {
			primes[i*k] = false;
		}

		do {
			k++;
		} while (!primes[k]);
	}

	return primes;
}

const seq = [0, 1];
const seqSet = new Set(seq);

for (let n = 2; n < 1800813; n++) {
	let k = seq[n-2] - n;
	if (k < 0 || seqSet.has(k)) {
		k = seq[n-2] + n;
	}

	seq[n] = k;
	seqSet.add(k);
}

const max = [...seqSet].reduce((max, num) => max > num ? max : num, 0);
const primes = erathostenes(max);

const primesInSeq = seq.reduce((ps, num) => primes[num] ? ps + 1 : ps);

console.log(primesInSeq);

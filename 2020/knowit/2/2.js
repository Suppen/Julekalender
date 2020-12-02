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

const luke2 = n => {
	const primes = erathostenes(n);

	let i = 0;
	let delivered = 0;
	while (i < n) {
		if (String(i).includes("7")) {
			let p = i;
			while (!primes[p]) {
				p--;
			}

			i += p;
		} else {
			delivered++;
		}

		i++;
	}

	return delivered;
}

console.log(luke2(5433000));

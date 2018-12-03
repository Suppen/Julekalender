"use strict";

console.time("Solved");

const upperBound = 4294967296; // This happens to be Math.pow(2, 32)

function getPrimes(max) {
	const primes = [2];
	let candidate = 3;
	while (candidate <= max) {
		let isPrime = true;
		let i = 0;
		while (isPrime && Math.pow(primes[i], 2) <= candidate) {
			isPrime = candidate % primes[i] !== 0;
			i++;
		}

		if (isPrime) {
			primes.push(candidate);
		}

		candidate += 2;
	}

	return primes;
}

function getMin2Factors(upperBound) {
	const min2Factors = null;
	let i = 0;
	while (Math.pow(3, i) * Math.pow(2, (24-i)) < upperBound) {
		i++;
	}
	return 24-(i-1);
}

function calculateProduct(primes, primeIndices, constantFactor) {
	return primeIndices.map(i => primes[i]).reduce((product, n) => product*n) * constantFactor;
}

function next(primes, primeIndices, constantFactor, upperBound) {
	// Clone the indices
	const indices = [...primeIndices];

	let i = 0;

	indices[i]++;
	do {
		if (indices[i] >= primes.length || calculateProduct(primes, indices, constantFactor) > upperBound) {
			indices[++i]++;
			for (let j = 0; j < i; j++) {
				indices[j] = indices[i];
			}
		}
	} while (calculateProduct(primes, indices, constantFactor) > upperBound);

	return indices;
}

// The largest prime factor needed is the highest possible to multiply with Math.pow(2, 23) bringing the product up to <= upperBound
const primes = getPrimes(upperBound / Math.pow(2, 23));

// There is a minimum power of two that can be in the product without it exceeding upperBound
const min2Factors = getMin2Factors(upperBound);
const constantFactor = Math.pow(2, min2Factors);

// The rest of the factors are not locked to two
let otherFactorsPrimeIndices = new Array(24 - min2Factors).fill(0);

let n = 0;
while (!Number.isNaN(otherFactorsPrimeIndices[0])) {
	otherFactorsPrimeIndices = next(primes, otherFactorsPrimeIndices, constantFactor, upperBound);
	n++;
}

console.timeEnd("Solved");

console.log(n);

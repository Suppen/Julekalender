"use strict";

// XXX Runs out of memory in nodejs and chrome. Works in Firefox

const elfSequence = (alphabet, length) => {
	const sequence = new Array(alphabet[0]).fill(alphabet[0]);

	let i = 1;
	while (sequence.length < length) {
		const letter = alphabet[i % alphabet.length];
		for (let j = 0; j < sequence[i]; j++) {
			sequence.push(letter);
		}
		i++;
	}

	return sequence.slice(0, length+1);
};

const answer = elfSequence([2, 3, 5, 7, 11], 217532235).reduce((sum, n) => n === 7 ? sum + n : sum, 0);
console.log(answer);

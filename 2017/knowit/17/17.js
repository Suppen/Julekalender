"use strict";

// Start a timer
console.time("Solved");

// UGLY BRUTE FORCE!!!!!!!
let num = -1;
while (true) {
	num++;

	if (Number.parseInt(num + "" + 6) * 4 === Number.parseInt(6 + "" + num)) {
		break;
	}
}

// Solved
console.timeEnd("Solved");
console.log(num + "" + 6);

"use strict";

// Start en timer
console.time();

// Definer starttallet
let tall = "1111321112321111";

// Definer antall iterasjoner
const iterasjoner = 50;

// Iterer
for (let i = 0; i < iterasjoner; i++) {
	// Noe å bygge det nye tallet fra
	let nyttTall = [];

	// Hold styr på hvilket siffer som sjekkes, og hvor mange av det det har vært
	let antall = 1;
	let siffer = tall.charAt(0);

	// Let!
	for (let j = 1; j < tall.length; j++) {
		// Er neste siffer det samme?
		if (tall.charAt(j) === siffer) {
			// Yup. Øk telleren
			antall++;
		} else {
			// Nope. Bygg det nye tallet
			nyttTall.push(antall);
			nyttTall.push(siffer);
			siffer = tall.charAt(j);
			antall = 1;
		}
	}

	// Bygg siste del av tallet
	nyttTall.push(antall);
	nyttTall.push(siffer);

	// Erstatt det gamle tallet med det nye
	tall = nyttTall.join("");
}

// Print resultatet
console.log(tall.length);
console.timeEnd();

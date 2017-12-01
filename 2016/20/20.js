"use strict";

// Start en timer
console.time();

// Generatorfunksjon som genererer alle mulige permutasjoner av arrayen den får som argument. Heaps algoritme, ikke-rekursiv
function* permutator(arr) {
	let c = [];
	let a = [];	// Klone av arrayen, så algoritmen ikke klusser med originalen

	for (let i = 0; i < arr.length; i++) {
		c[i] = 0;
		a[i] = arr[i];
	}

	yield a;

	let i = 0;
	while (i < a.length) {
		if (c[i] < i) {
			if (i % 2 === 0) {
				let tmp = a[0];
				a[0] = a[i];
				a[i] = tmp;
			} else {
				let tmp = a[c[i]];
				a[c[i]] = a[i];
				a[i] = tmp;
			}

			yield a;

			c[i]++;
			i = 0;
		} else {
			c[i] = 0;
			i++;
		}
	}
}

// Lag en permutator for alle siffer
let sifferpermutator = permutator("0123456789".split(""));

// Hold styr på de foreløpig beste resultatene
let maxA, maxB;
let maxProdukt = 0;

// Gå gjennom alle permutasjoner
for (let perm of sifferpermutator) {
	// Gjør den om til en string
	let tall = perm.join("");

	// Prøv alle mulige plasseringer av multiplikatoren
	for (let i = 2; i < tall.length; i++) {
		let a = Number.parseInt(tall.substring(0, i));
		let b = Number.parseInt(tall.substring(i));
		let produkt = a*b;

		if (produkt > maxProdukt) {
			maxProdukt = produkt;
			maxA = a;
			maxB = b;
		}
	}
}

console.log(maxA, maxB);
console.log(maxProdukt);
console.timeEnd();

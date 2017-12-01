"use strict";

// Start en timer
console.time();

// Meldingen, prosessert for å kunne krypteres
let melding = "Your message was received with gratitude! We do not know about you, but Christmas is definitely our favourite holiday. The tree, the lights, all the presents to unwrap. Could there be anything more magical than that?! We wish you a happy holiday and a happy new year!".toLowerCase().replace(/[^a-z]/g, "");

// Alle mulige romertall i denne oppgaven
const romertall = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII"];

// Den krypterte meldingen
const chiffer = [];

// Tallverdien til "a"
const a = "a".charCodeAt(0) - 1;

// Krypter!
for (let i = melding.length - 1; i >= 0; i--) {
	let bokstav = melding.charAt(i);

	// Finn tallverdien
	let tall = (bokstav.charCodeAt(0) - a) / 2;

	// Krypter
	chiffer.unshift(romertall[Math.ceil(tall)]);
	chiffer.push(romertall[Math.floor(tall)]);
}

// Print resultatet
console.log(chiffer.join(", "));
console.timeEnd();

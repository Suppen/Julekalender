"use strict";

console.time();

let kolonnenr = 90101894;

let kolonnenavn = "";

let A = "A".charCodeAt(0);

do {
	kolonnenr--;
	kolonnenavn = String.fromCharCode(A + (kolonnenr % 26)) + kolonnenavn;
	kolonnenr = Math.floor(kolonnenr / 26);
} while (kolonnenr > 0);

console.log(kolonnenavn);
console.timeEnd();

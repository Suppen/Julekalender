"use strict";

const fs = require("fs");

// Hent filen
let venneliste = fs.readFileSync("venneliste.txt", "utf-8");

console.time();

// Preparer listen
venneliste = venneliste.split("\r\n").map(l => l.trim().split(/\s+/));

let personer = {};
let kameleoner = {};

// Lag personliste
for (let linje of venneliste) {
	for (let element of linje) {
		if (element !== "hates" && element !== "friends") {
			personer[element] = {};
		}
	}
}

// Finn vennepar
for (let linje of venneliste) {
	if (linje[0] === "friends") {
		personer[linje[1]][linje[2]] = true;
		personer[linje[2]][linje[1]] = true;
	}
}

// Finn ut hvem som hater hvem
for (let linje of venneliste) {
	if (linje[1] === "hates") {
		personer[linje[0]][linje[2]] = false;
	}

}

// Finn kameleoner
for (let a in personer) {
	for (let b in personer) {
		if (!personer[a][b] && personer[b][a]) {
			if (kameleoner[a] === undefined) {
				kameleoner[a] = 0;
			}
			kameleoner[a]++;
		}
	}
}

// Finn største kameleon
let sk = Object.keys(kameleoner).reduce((sk, navn) => {
	if (kameleoner[navn] > sk[1]) {
		sk = [navn, kameleoner[navn]];
	}
	return sk;
}, ["kake", 0]);

console.log(sk[0]);
console.timeEnd();

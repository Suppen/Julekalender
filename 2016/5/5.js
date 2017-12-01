"use strict";

const fs = require("fs");

let kryptomelding = fs.readFileSync("kryptomelding.txt", "utf-8");

console.time();

// Alle mulige romertall i denne oppgaven
const romans = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI"];

// Bytt ut romer med desimal
for (let i in romans) {
	kryptomelding = kryptomelding.replace(new RegExp("\\b" + romans[i] + "\\b", "g"), i);
}

// Parse som JSON
kryptomelding = JSON.parse(kryptomelding);

let result = [];

// Legg sammen første og siste tall
while (kryptomelding.length > 0) {
	result.push(kryptomelding.shift() + kryptomelding.pop());
}

// Konverter til bokstaver
let a = "a".charCodeAt(0)-1;
result = result.map(n => String.fromCharCode(a+n)).join("");

// Print resultatet
console.log(result);
console.timeEnd();

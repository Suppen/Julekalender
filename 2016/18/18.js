"use strict";

// Start en timer
console.time();

// Hold styr på hvor mye lys hvert siffer gir
let lysstyrke = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];

// Finn lyseste og mørkeste siffer som er mulig på de forskjellige plassene
let lysesteEner = 0;
let morkesteEner = 0;
for (let siffer = 0; siffer <= 9; siffer++) {
	if (lysstyrke[siffer] > lysstyrke[lysesteEner]) lysesteEner = siffer;
	if (lysstyrke[siffer] < lysstyrke[morkesteEner]) morkesteEner = siffer;
}
let lysesteTier = 0;
let morkesteTier = 0;
for (let siffer = 0; siffer <= 5; siffer++) {
	if (lysstyrke[siffer] > lysstyrke[lysesteTier]) lysesteTier = siffer;
	if (lysstyrke[siffer] < lysstyrke[morkesteTier]) morkesteTier = siffer;
}
let lysesteTimeTier = 1;
let morkesteTimeTier = 0;	// 0 på tiertimene er av, altså ingen lysstyrke. Definert i oppgaven
for (let siffer = 1; siffer <= 2; siffer++) {
	if (lysstyrke[siffer] > lysstyrke[lysesteTimeTier]) lysesteTimeTier = siffer;
}
let lysesteTimeEner = 0;
let lysesteMaxTimeEner = lysesteTimeTier === 2 ? 3 : 9;
for (let siffer = 0; siffer <= lysesteMaxTimeEner; siffer++) {
	if (lysstyrke[siffer] > lysstyrke[lysesteTimeEner]) lysesteTimeEner = siffer;
}
let morkesteTimeEner = 0;
let morkesteMaxTimeEner = morkesteTimeTier === 2 ? 3 : 9;
for (let siffer = 0; siffer <= morkesteMaxTimeEner; siffer++) {
	if (lysstyrke[siffer] < lysstyrke[morkesteTimeEner]) morkesteTimeEner = siffer;
}

// Finn de lyseste/mørkeste tidspunktene
let lysest = `${lysesteTimeTier}${lysesteTimeEner}:${lysesteTier}${lysesteEner}:${lysesteTier}${lysesteEner}`;
let morkest = `${morkesteTimeTier}${morkesteTimeEner}:${morkesteTier}${morkesteEner}:${morkesteTier}${morkesteEner}`;

// Gjør de om til timestamps på en eller annen dag
lysest = new Date("2016-12-18T" + lysest + "Z");
morkest = new Date("2016-12-18T" + morkest + "Z");

// Regn ut tiden mellom dem
let sekunderTotalt = (lysest - morkest) / 1000;

// Hvis det mørkeste tidspunktet er etter det lyseste, trekk antall sekunder fra 24 timer
if (sekunderTotalt < 0) {
	sekunderTotalt = (24*60*60) - sekunderTotalt;
}

// Bryt antall sekunder ned i timer, minutter og sekunder
let minutter = Math.floor(sekunderTotalt / 60);
let sekunder = sekunderTotalt % 60;
let timer = Math.floor(minutter / 60);
minutter = minutter % 60;

// Print resultatet
console.log(`${timer}:${minutter}:${sekunder}`);
console.timeEnd();

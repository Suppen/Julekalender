"use strict";

// Start en timer
console.time();

// Definer eventyrerne. Tyven ser ut til å være udødelig, så drit i å holde styr på han
let eventyrere = {
	trollmann: true,
	kriger: true,
	prest: true
};

// Definer antall fanger
let fanger = 17;

// Definer antall rom
let antallRom = 100;

// Antall goblins totalt (n*(n+1))/2
let goblinsTotalt = (antallRom * (antallRom+1)) / 2;

// Traverser rommene
for (let rom = 1; rom <= antallRom; rom++) {
	// Hvert rom har [romnummer] goblins
	let goblins = rom;

	// Trollmannen kan gjenopplive max. 1 annen eventyrer pr. rom
	let gjenopplivet = false;

	// Prosesser rommet
	do {
		// Hvis Tyven er i live og det er goblins igjen i dette rommet, dreper han 1 goblin.
		if (goblins > 0) {
			goblins--;
			goblinsTotalt--;
		}

		// Hvis Trollmannen er i live og det er goblins igjen i dette rommet, dreper han (opptil) 10 goblins.
		if (eventyrere.trollmann === true && goblins > 0) {
			let goblinsDrept = goblins > 10 ? 10 : goblins;
			goblins -= goblinsDrept;
			goblinsTotalt -= goblinsDrept;
		}

		// Hvis Krigeren er i live og det er goblins igjen i dette rommet, dreper han 1 goblin.
		if (eventyrere.kriger === true && goblins > 0) {
			goblins--;
			goblinsTotalt--;
		}

		// Hvis Presten er i live og en annen eventyrer ikke er det, gjenoppliver presten en av de som ikke er i live. Hvis det er flere som ikke er i live velger han først Krigeren, så Trollmannen. Tyven vil han ikke gjenopplive, han har syndet for mye. Presten kan gjøre dette maks en gang per rom, og han kan ikke gjenopplive eventyrere som ble forlatt døde i et tidligere rom.
		if (eventyrere.prest === true && !gjenopplivet) {
			// Forsøk gjenoppliving
			if (eventyrere.kriger === rom) {
				eventyrere.kriger = true;
				gjenopplivet = true;
			} else if (eventyrere.trollmann === rom) {
				eventyrere.trollmann = true;
				gjenopplivet = true;
			}
		}

		// Hvis Tyven er den eneste som er i live, sniker han seg videre (til neste rom eller til fangene hvis dette er rom 100), og ignorerer de goblinene som var igjen i dette rommet. Goblinene som var igjen i rommet leter etter ham, men går seg bort i tunellene og starter et nytt og bedre liv et annet sted.
		if (eventyrere.trollmann !== true && eventyrere.kriger !== true && eventyrere.prest !== true) {
			break;
		}

		// Hvis det fremdeles er både eventyrere og goblins i rommet, og det er minst 10 ganger flere goblins enn eventyrerene som er igjen, så dreper goblinene en av eventyrerene. De dreper først Krigeren om han er i live, deretter Trollmannen, så Presten. Tyven finner de ikke.
		let iLive = 1;
		if (eventyrere.trollmann === true) iLive++;
		if (eventyrere.kriger === true) iLive++;
		if (eventyrere.prest === true) iLive++;
		if (goblins / iLive >= 10) {
			if (eventyrere.kriger === true) eventyrere.kriger = rom;
			else if (eventyrere.trollmann === true) eventyrere.trollmann = rom;
			else if (eventyrere.prest === true) eventyrere.prest = rom;
		}

		// Hvis det fremdeles er både eventyrere og goblins i rommet, gå til punkt 1 (ny runde i samme rom). Hvis ikke, gå til neste rom og start en runde - med mindre dette var det siste rommet, i hvilket tilfelle de resterende eventyrerene finner fangene og befrir dem.
	} while (goblins > 0);
}

// Finn ut hvor mange som overlevde
let iLive = 1;	// Tyven overlevde. Sjekk resten
if (eventyrere.trollmann === true) iLive++;
if (eventyrere.kriger === true) iLive++;
if (eventyrere.prest === true) iLive++;
// Legg til overlevende goblins
iLive += goblinsTotalt;
// Legg til fangene
iLive += fanger;

// Print resultatet
console.log(iLive);
console.timeEnd();

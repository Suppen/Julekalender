const carrotCooldown = 30;
const meatCooldown = 50;

const s = {
	t: 0,
	rice: 100,
	peas: 100,
	carrots: 100,
	meat: 100,
	pretzels: 100,

	riceRefillIndex: 0,
	peaRefillIndex: 0,
	carrotRefillIndex: 0,
	meatRefillIndex: 0,

	carrotCooldown,
	meatCooldown,
};

const bigPortion = 5;
const smallPortion = 3;
const meatPortion = 2;
const pretzelPortion = 1;

const eatRice = () => {
	const portion = Math.min(bigPortion, s.rice);
	s.rice -= portion;
};

const eatPeas = (portionSize: "big" | "small") => {
	const portion = Math.min(portionSize === "big" ? bigPortion : smallPortion, s.peas);
	s.peas -= portion;
}

const eatCarrots = (portionSize: "big" | "small") => {
	const portion = Math.min(portionSize === "big" ? bigPortion : smallPortion, s.carrots);
	s.carrots -= portion;
};

const eatMeat = () => {
	s.meat -= meatPortion;
};

const eatPretzel = () => {
	s.pretzels -= pretzelPortion;
};

const riceRefills = [0, 0, 1, 0, 0, 2];
const peaRefills = [0, 3, 0, 0];
const carrotRefills = [0, 1, 0, 0, 0, 8];
const meatRefills = [100, 80, 40, 20, 10];

const refillRice = () => {
	const refill = riceRefills[s.riceRefillIndex];
	s.rice += refill;
	s.riceRefillIndex = (s.riceRefillIndex + 1) % riceRefills.length;
};

const refillPeas = () => {
	const refill = peaRefills[s.peaRefillIndex];
	s.peas += refill;
	s.peaRefillIndex = (s.peaRefillIndex + 1) % peaRefills.length;
};

const refillCarrots = () => {
	if (s.carrotCooldown === 0) {
		const refill = carrotRefills[s.carrotRefillIndex];
		s.carrots += refill;
		s.carrotRefillIndex = (s.carrotRefillIndex + 1) % carrotRefills.length;
	} else {
		s.carrotCooldown--;
	}
};

const refillMeat = () => {
	if (s.meat === 0) {
		if (s.meatRefillIndex < meatRefills.length) {
			if (s.meatCooldown === 0) {
				const refill = meatRefills[s.meatRefillIndex];
				s.meat += refill;
				s.meatRefillIndex++;
				s.meatCooldown = meatCooldown;
			} else {
				s.meatCooldown--;
			}
		}
	}
};

do {
	if (s.rice > 0) {
		eatRice();

		if (s.peas > 0) {
			eatPeas("small");
		} else if (s.carrots > 0) {
			eatCarrots("small");
		}
	} else if (s.peas > 0) {
		eatPeas("big");

		if (s.carrots > 0) {
			eatCarrots("small");
		}
	} else if (s.carrots > 0) {
		eatCarrots("big");
	} else if (s.meat > 0) {
		eatMeat();
	} else {
		eatPretzel();
	}

	refillRice();
	refillPeas();
	refillCarrots();
	refillMeat();

	s.t++;
} while (s.pretzels > 0);

console.debug(`t=${s.t}`);

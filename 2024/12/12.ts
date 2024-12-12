function* fib(): Generator<number, never, never> {
	let a = 0;
	let b = 1;
	let c = Infinity;

	while (true) {
		yield a;
		c = a + b;
		a = b;
		b = c;
	}
};

const fortyFib: number[] = [];
const fibGen = fib();
for (let i = 0; i < 40; i++) {
	fortyFib.push(fibGen.next().value);
}


const startDate = new Date("2020-04-01T12:00:00");
const endDate = new Date("2024-12-12T12:00:00");

let currentDate = startDate;
let currentStreak = 1;
let sundayStreak = 0;

const getAdventSundays = (year: number): Date[] => {
	const christmas = new Date(`${year}-12-24T12:00:00`);
	const lastSundayBeforeChristmas = new Date(christmas);
	lastSundayBeforeChristmas.setDate(christmas.getDate() - christmas.getDay());

	const adventSundays: Date[] = [];
	for (let i = 0; i < 4; i++) {
		const adventSunday = new Date(lastSundayBeforeChristmas);
		adventSunday.setDate(lastSundayBeforeChristmas.getDate() - i * 7);
		adventSundays.push(adventSunday);
	}
	return adventSundays;
};

let adventSundays: Date[] = [];
for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
	adventSundays = adventSundays.concat(getAdventSundays(year));
}

const isJuly = () => currentDate.getMonth() === 6; // Stupid JS having 0-indexed months...
const isAdvent = () => adventSundays.some(s => currentDate.toISOString().slice(0, 10) === s.toISOString().slice(0, 10));
const isSunday = () => currentDate.getDay() === 0; // Stupid JS starting the week on sundays...
const isThirdSunday = () => sundayStreak === 2;
const isLastSundayInJuly = () => isJuly() && isSunday() && currentDate.getDate() >= 25 && currentDate.getDate() <= 31;
const isLastSundayInAdvent = () => isAdvent() && isSunday() && currentDate.getDate() >= 25 && currentDate.getDate() <= 31;
const addOneDay = () => (currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));

let sundays = 0;

const badUpdate = () => {
	currentStreak = 0;
	sundayStreak = 0;
};

let bookmarks = 0;

const makeBookmarks = () => {
	bookmarks += fortyFib[currentStreak++];
}

while (currentDate <= endDate) {
	if (isSunday()) {
		if (isJuly() || isAdvent() || isThirdSunday()) {
			badUpdate();
		} else {
			sundayStreak++;
		}
	}

	makeBookmarks();

	addOneDay();
}

console.log(bookmarks);

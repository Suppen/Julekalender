const rmax = 10 ** 6;
const alpha = 0.2;
const gamma = 7.5e-5;
const lambda = 83;
const beta = 0.1;
const r0 = 125000;
const u0 = 3500;
const targetYear = 10 ** 12;

const rn = (rp, up) => Math.floor(rp + (alpha * rp * (rmax - rp)) / rmax - gamma * up * rp);

const un = (up, rp) => Math.floor(up + (gamma * up * rp) / lambda - beta * up);

const runYear = ([r, u]) => [rn(r, u), un(u, r)];

const points = [];

let [r, u] = [r0, u0];
let year = 0;
let cycleStartYear = -1;
do {
	points[year] = [r, u];

	[r, u] = runYear([r, u]);

	cycleStartYear = points.findIndex(([rn, un]) => rn === r && un === u);

	year++;
} while (cycleStartYear === -1);

const cycleLength = year - cycleStartYear;

year = Math.floor((targetYear - year) / cycleLength) * cycleLength + year;

while (year < targetYear) {
	[r, u] = runYear([r, u]);
	year++;
}

console.log(r);

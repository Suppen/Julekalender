const A = Math.PI * 5 * Math.sqrt(5 ** 2 + 16 ** 2);
const things = [10 * 0.04, 15 * 0.04, 30 * 0.02, 15 * 0.05];
const price = things.map(t => t * A).reduce((sum, num) => sum + num);

console.log(10 * Math.round(price / 10));

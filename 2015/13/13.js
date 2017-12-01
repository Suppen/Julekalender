var upTo = Number.MAX_SAFE_INTEGER*100;

var knalls = [];

var fives = 0;
var fiveProd = 1;
do {
	var threes = 0;
	var threeProd = 1;
	do {
		var twos = 0;
		var twoProd = 1;
		do {
			knalls.push(twoProd * threeProd * fiveProd);
			twos++;
			twoProd = Math.pow(2, twos);
		} while (twoProd * threeProd * fiveProd <= upTo);
		threes++;
		threeProd = Math.pow(3, threes);
	} while (threeProd * fiveProd <= upTo);
	fives++;
	fiveProd = Math.pow(5, fives);
} while (fiveProd <= upTo);

knalls.sort((a, b) => {
	return a - b;
});

console.log(knalls[9999]);

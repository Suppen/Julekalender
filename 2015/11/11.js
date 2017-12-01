var fs = require("fs");

var romans = {M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1};

var numbers = fs.readFileSync("11.txt", "utf-8").split("\r\n");

numbers = numbers.map(n => {
	var value = Number(n);
	if (Number.isNaN(value)) {
		value = 0;
		var roman = n;
		while (roman != "") {
			for (var p in romans) {
				if (roman.indexOf(p) == 0) {
					value += romans[p];
					roman = roman.substr(p.length);
					break;
				}
			}
		}
	}

	return {number: n, value};
}).sort((a, b) => {
	return b.value - a.value;
});
var middle = Math.ceil(numbers.length/2)
console.log(numbers[middle]);

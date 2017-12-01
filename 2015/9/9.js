var num = 142453146368;
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
var digits = [];

do {
	num--;
	var rest = num % alphabet.length;
	digits.unshift(alphabet[rest]);
	num -= rest;
	num /= alphabet.length;
} while (num > 0);

console.log(digits.join(""));

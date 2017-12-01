var upTo = 100000000;
var sum = 0;
for (var i = 7; i < upTo; i += 7) {
	if (i % 5 != 0) {
		sum += i;
	}
}
console.log(sum);

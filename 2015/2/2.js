var fs = require("fs");
var verdier = fs.readFileSync("2.txt").toString("utf-8").split("\r\n").map(parseFloat);
var maxDiff = 0;
for (var i = 0; i < verdier.length-1; i++) {
	for (var j = i+1; j < verdier.length; j++) {
		if (verdier[j] - verdier[i] > maxDiff) {
			maxDiff = verdier[j] - verdier[i];
		}
	}
}
console.log(maxDiff);

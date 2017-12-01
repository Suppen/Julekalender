var fs = require("fs");
var ord = fs.readFileSync("5.txt").toString("utf-8").split("\r\n");
var anagrams = {};
for (var i = 0; i < ord.length-1; i++) {
	var sortert = ord[i].split("").sort().join("");
	if (typeof anagrams[sortert] != "undefined") {
		anagrams[sortert]++;
	} else {
		anagrams[sortert] = 1;
	}
}
var totalt = 0;
for (var a in anagrams) {
	if (anagrams[a] > 1) {
		totalt += anagrams[a];
	}
}

console.log(totalt);

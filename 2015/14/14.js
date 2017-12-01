var upsideDown = {0: 0, 1: 1, 6: 9, 8: 8, 9: 6};

var amount = 0;
for (var i = 0; i < 100000; i++) {
	var n = ("" + i).split("");
	var isUpsideDownable = true;
	for (var j = 0; j < n.length/2 && isUpsideDownable; j++) {
		isUpsideDownable = n[j] == upsideDown[n[n.length-j-1]];
	}
	if (isUpsideDownable) {
		amount++;
	}
}
console.log(amount);

function tribonacci(n) {
	var a = 0;
	var b = 0;
	var c = 1;
	for (var k = 0; k < n; k++) {
		var d = a+b+c;
		a = b;
		b = c;
		c = d;
	}
	return c;
}
console.log(tribonacci(30));

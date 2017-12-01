var mirps = 0;
for (var i = 13; i < 1000; i += 2) {
	if (!isPalindrome(i) && isPrime(i) && isPrime(reverse(i))) {
		mirps++;
	}
}
console.log(mirps);

function isPrime(num) {
	var sqrt = Math.sqrt(num);
	var isPrime = num % 2 != 0;
	for (var i = 3; i <= sqrt && isPrime; i += 2) {
		isPrime = num % i != 0;
	}
	return isPrime;
};

function isPalindrome(num) {
	return reverse(num) == num;
};

function reverse(num) {
	return parseInt((num + "").split("").reverse().join(""));
};

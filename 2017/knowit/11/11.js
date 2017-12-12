"use strict";

// Start a timer
console.time("Solved");

/**
 * Checks if a number is a prime number
 *
 * @param {Integer} num	The number to check
 *
 * @returns {Boolean}	True if the number is prime, false otherwise
 */
function isPrime(num) {
	var sqrt = Math.sqrt(num);
	var isPrime = num % 2 != 0;
	for (var i = 3; i <= sqrt && isPrime; i += 2) {
		isPrime = num % i != 0;
	}
	return isPrime;
}

/**
 * Checks if a number is a palindrome
 *
 * @param {Integer} num	The number to check
 *
 * @returns {Boolean}	True if the number is a palindrome, false otherwise
 */
function isPalindrome(num) {
	return reverse(num) == num;
}

/**
 * Reverses the digits in a number
 *
 * @param {Integer} num	The number to reverse
 *
 * @returns {Integer}	The number with the digits reversed
 */
function reverse(num) {
	return parseInt((num + "").split("").reverse().join(""));
}

// Keep track of number of mirps
let mirps = 0;

// Find all mirps
for (var i = 13; i < 1000; i += 2) {
	if (!isPalindrome(i) && isPrime(i) && isPrime(reverse(i))) {
		mirps++;
	}
}

// Solved!
console.timeEnd("Solved");
console.log(mirps);


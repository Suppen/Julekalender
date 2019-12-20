"use strict";

function* nums(start, end) {
	let i = start;
	do {
		yield i++;
	} while (i <= end);
}

const isPalindrome = n => {
	const s = n.toString();
	const l = s.length;
	const lh = l / 2;
	for (let i = 0; i < lh; i++) {
		if (s.charAt(i) !== s.charAt(l-1-i)) {
			return false;
		}
	}
	return true;
};

const isHiddenPalindrome = n => isPalindrome(Number.parseInt(n.toString().split("").reverse().join("")) + n);

let sum = 0;
for (const n of nums(1, 123454321)) {
	if (isHiddenPalindrome(n) && !isPalindrome(n)) {
		sum += n;
	}
}

console.log(sum);

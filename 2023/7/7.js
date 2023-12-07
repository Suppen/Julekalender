let str = "";
let count = 0;

for (let i = 0; i < 100_000; i++) {
	const iStr = i.toString();
	if (!str.includes(iStr)) {
		count++;
		str += iStr;
	}
}

console.log(str);

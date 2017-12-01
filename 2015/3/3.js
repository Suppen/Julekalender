var fridays = 0;

var day = 6;
for (var year = 2015; year >= 1; year--) {
	day--;
	if (year % 4 == 0 && (year % 100 != 0 && year % 400 == 0)) {
		day--;
	}
	if (day < 0) {
		day = 7 + day;
	}
	if (day == 4) {
		fridays++;
	}
}

console.log(fridays);

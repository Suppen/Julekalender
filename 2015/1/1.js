var valid = 0;
require("fs").readFileSync("1.txt").toString("utf-8").split("\r\n").forEach(id => {
	if (id.match(/^[a-z]{0,3}[0-9]{2,8}[A-Z]{3,}$/) != null) {
		valid++;
	}
});
console.log(valid);

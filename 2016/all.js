var fs = require("fs");
var exec = require("child_process").execSync;

console.time("Total");

for (var i = 1; i <= 24; i++) {
	process.chdir("./" + i);
	var exe = "node " + i + ".js";
	try {
		fs.statSync(i + ".sh");
		exe = "./" + i + ".sh";
	} catch (e) {}
	try {
		fs.statSync("Luke" + i + ".class");
		exe = "java Luke" + i;
	} catch (e) {}
	try {
		fs.statSync("a.out");
		exe = "./a.out";
	} catch (e) {}
	console.time(i);
	exec(exe);
	console.timeEnd(i);
	process.chdir("./..");
}

console.timeEnd("Total");

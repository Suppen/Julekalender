var fs = require("fs");
var words = fs.readFileSync("21.txt", "utf-8").split("\r\n");
words.push("sand");

var map = {};

words.forEach(function(word) {
	map[word] = words.filter(function(w) {
		var diff = 0;
		for (var i = 0; i < w.length && diff <= 1; i++) {
			if (word.charAt(i) != w.charAt(i)) {
				diff++;
			}
		}
		return diff == 1;
	});
});

function bfs(map, start, end) {
	var nodes = {};
	for (var n in map) {
		nodes[n] = {
			dist: Number.POSITIVE_INFINITY,
			parent: null
		};
	}

	var Q = [];

	nodes[start].dist = 0;
	Q.push(start);

	while (Q.length > 0) {
		var current = Q.shift();

		for (var i = 0; i < map[current].length; i++) {
			var n = map[current][i];
			if (nodes[n].dist == Number.POSITIVE_INFINITY) {
				nodes[n].dist = nodes[current].dist+1;
				nodes[n].parent = current;
				Q.push(n);
			}
		}
	}
	return nodes;
};

var start = "sand";
var end = "hold";

var paths = bfs(map, start, end);
var current = end;
var path = [current];
while (current != start) {
	path.unshift(paths[current].parent);
	current = paths[current].parent;
}
console.log('"' + path.join('" -> "') + '"');
console.log(paths[end].dist+1);

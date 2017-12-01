var map = [
	["34", "21", "32", "41", "25"],
	["14", "42", "43", "14", "31"],
	["54", "45", "52", "42", "23"],
	["33", "15", "51", "31", "35"],
	["21", "52", "33", "13", "23"]
];

function traverse(pos, path, map) {
	path.push(pos);
	truePos = pos.split("").map(function(d) {return d-1;}).join("");
	if (map[truePos[0]][truePos[1]] == pos) {
		return path;
	}
	return traverse(map[truePos[0]][truePos[1]], path, map);
};
console.log(traverse("11", [], map).join(", "));

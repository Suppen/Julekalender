var word = "evdhtiqgfyvcytohqppcmdbultbnzevdbakvkcdpbatbtjlmzaolfqfqjifkoanqcznmbqbeswglgrzfroswgxoritbw";

var operations = 0;
for (var i = 0; i < word.length/2; i++) {
	operations += Math.abs(word.charCodeAt(i) - word.charCodeAt(word.length-i-1));
}

console.log(operations);

var sum = 0;
for (var n = 1; n < 1000/7; n++) {
  var num = n*7;
  var rev = parseInt((num + "").split("").reverse().join(""));
  if (rev % 7 == 0) {
    sum += num;
  }
}
console.log(sum);

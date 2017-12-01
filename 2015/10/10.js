var fs = require("fs");
var values = fs.readFileSync("10.txt").toString("utf-8").split("\r\n").map(parseFloat);

var maxProfit = 0;
for (var sell2 = 3; sell2 < values.length; sell2++) {
	for (var buy2 = 2; buy2 < sell2; buy2++) {
		if (values[sell2] - values[buy2] < 20) {
			continue;
		}
		for (var sell1 = 1; sell1 < buy2; sell1++) {
			for (var buy1 = 0; buy1 < sell1; buy1++) {
				if (values[sell1] - values[buy1] < 20) {
					continue;
				}
				var profit = (values[sell1] - values[buy1]) + (values[sell2] - values[buy2]);
				if (profit > maxProfit) {
					maxProfit = profit;
				}
			}
		}
	}
}
console.log(maxProfit);

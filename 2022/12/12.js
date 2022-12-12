import { execSync } from "child_process";
import { readdirSync, writeFileSync } from "fs";

const coords = readdirSync("./pokemon")
	.map(filename => {
		const tuples = execSync(`identify -verbose pokemon/${filename}`, { encoding: "utf-8" })
			.split("\n")
			.flatMap(l => {
				const regex = /(\d+)\/(\d+), (\d+)\/(\d+)/;
				const matches = regex.exec(l);

				const doMath = m => Number(m[1]) / Number(m[2]) + Number(m[3]) / Number(m[4]) / 60;

				if (l.includes("GPSLatitude:")) {
					return [["N", doMath(matches)]];
				} else if (l.includes("GPSLongitude:")) {
					return [["E", doMath(matches)]];
				} else {
					return [];
				}
			});
		return new Map(tuples);
	})
	.map(m => [m.get("N"), m.get("E")]);

writeFileSync("coords.txt", coords.map(([n, e]) => `${n} ${e}`).join("\n"));

import fs from "fs";

const addMinutes = (ts, mins) =>
	new Date(ts.getTime() + 1000 * 60 * mins);

const factory = fs.readFileSync("./factory.txt", "utf-8")
	.split("\n")
	.map(line => line.split(", "))
	// Parse the lines into an object with the machine's start time and a list of tasks
	.map(([time, ...rest]) => {
		const startTime = new Date(`2021-12-19T${time}:00Z`);

		const tasks = [];
		for (let i = 0; i < rest.length; i += 3) {
			tasks.push({
				prodTime: Number(rest[i+1]),
				packTime: Number(rest[i+2])
			})
		}

		return { startTime, tasks };
	})
	// Produce the things
	.flatMap(({ startTime, tasks }) => {
		let time = startTime;
		let things = [];
		for (const task of tasks) {
			time = addMinutes(time, task.prodTime);
			things.push({
				prodEnd: time,
				packTime: task.packTime
			});
		}

		return things;
	})
	// Sort them by the time the production ends
	.sort((a, b) => a.prodEnd.getTime() - b.prodEnd.getTime())
	// Pack the things
	.reduce((tables, thing) => {
		// Find a free table
		const tableIndex = tables.findIndex(table => table.finishes.getTime() <= thing.prodEnd.getTime());
		// If there is a free table, remove it from the list
		if (tableIndex >= 0) {
			tables.splice(tableIndex, 1);
		}
		// Make a new table to pack the thing on
		tables.push({ finishes: addMinutes(thing.prodEnd, thing.packTime) });

		return tables;
	}, [])
	.length;

console.log(factory);

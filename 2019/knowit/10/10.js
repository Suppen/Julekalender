"use strict";

const fs = require("fs");
const R = require("ramda");

const year = 2018;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toothpasteTubeSize = 125;
const shampooBottleSize = 300;
const toiletpaperRollSize = 25;

const getConsumption = R.curry((consumable, consumption) =>
	R.compose(
		Number,
		R.head,
		R.match(/\d+/),
		R.find(R.includes(consumable)),
	)(consumption)
);

R.compose(
	console.log.bind(console),
	// Calculate the answer
	m => {
		const toothpasteTubes = Math.floor(m.get("toothpasteTotal") / toothpasteTubeSize);
		const toiletpaperRolls = Math.floor(m.get("toiletpaperTotal") / toiletpaperRollSize);
		const shampooBottles = Math.floor(m.get("shampooTotal") / shampooBottleSize);

		return toothpasteTubes * shampooBottles * toiletpaperRolls * m.get("shampooSundays") * m.get("toiletpaperWednesdays");
	},
	R.tap(console.log.bind(console)),
	R.reduce((m, { day, toothpaste, toiletpaper, shampoo }) => {
		m.set("toothpasteTotal", m.get("toothpasteTotal") + toothpaste);
		m.set("toiletpaperTotal", m.get("toiletpaperTotal") + toiletpaper);
		m.set("shampooTotal", m.get("shampooTotal") + shampoo);
		if (day === "Sunday") {
			m.set("shampooSundays", m.get("shampooSundays") + shampoo);
		}
		if (day === "Wednesday") {
			m.set("toiletpaperWednesdays", m.get("toiletpaperWednesdays") + toiletpaper);
		}
		return m;
	}, new Map([
		["toothpasteTotal", 0],
		["toiletpaperTotal", 0],
		["shampooTotal", 0],
		["shampooSundays", 0],
		["toiletpaperWednesdays", 0]
	])),
	// Parse those chunks
	R.map(([day, ...consumption]) => {
		const [monthName, date] = R.compose(R.split(" "), R.replace(":", ""))(day);
		const month = R.indexOf(monthName, months);

		return {
			day: days[new Date(year, month, date).getDay()],
			toothpaste: getConsumption("tannkrem", consumption),
			toiletpaper: getConsumption("toalettpapir", consumption),
			shampoo: getConsumption("sjampo", consumption)
		};
	}),
	// Divide the lines into chunks of 4
	R.splitEvery(4),
	// Divide the input into lines and remove the empty last one
	R.slice(0, -1),
	R.split("\n")
)(fs.readFileSync("input.txt", "utf-8"));

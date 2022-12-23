import { readFileSync } from "fs";

export const parseTrips = str =>
	str
		.split("\n")
		.slice(0, -1)
		.map(l => l.split(","))
		.map(([start_station_id, end_station_id, started_at, ended_at]) => ({
			startStation: Number(start_station_id),
			endStation: Number(end_station_id),
			startTime: new Date(started_at),
			endTime: new Date(ended_at)
		}));

export const parseTripsFile = fileName => parseTrips(readFileSync(fileName, "utf-8"));

export const bikeMap = trips =>
	trips.reduce((bikes, trip) => {
		const bikesAtStation = bikes.get(trip.startStation) ?? [];
		const bikeI = bikesAtStation.findIndex(b => b <= trip.startTime);

		if (bikeI >= 0) {
			bikesAtStation.splice(bikeI, 1);
		}

		bikes.set(trip.startStation, bikesAtStation);
		bikes.set(trip.endStation, [...(bikes.get(trip.endStation) ?? []), trip.endTime]);

		return bikes;
	}, new Map());

const solve = () =>
	[...bikeMap(parseTripsFile("trips.csv")).values()].reduce((total, bikes) => total + bikes.length, 0);

const answer = solve(parseTripsFile("trips.csv"));

console.log(answer);

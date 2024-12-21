import { readFileSync } from "node:fs";
import * as turf from "@turf/turf";

type Coordinate = [number, number];

type Shop = {
	remainingGrøtris: number;
	coordinate: Coordinate;
}

const shops: Shop[] = readFileSync("butikker.csv", "utf8")
	.split("\n")
	.slice(1, -1)
	.map((l: string) => {
		const [lat, lon, remainingGrøtris] = l.split(",");

		return {
			remainingGrøtris: Number.parseFloat(remainingGrøtris),
			coordinate: [Number.parseFloat(lon.slice(0, -1)), Number.parseFloat(lat.slice(1))]
		};
	});

const norway = JSON.parse(readFileSync("norge.geojson", "utf8")).features[0].geometry;

const shopsWithGrøtrisInNorway = shops
	.filter(shop => shop.remainingGrøtris > 0)
	.filter(shop => turf.booleanPointInPolygon(turf.point(shop.coordinate), norway))
	.map(shop => shop.coordinate);

const haversineDistance = (coord1: Coordinate, coord2: Coordinate): number => {
	const toRad = (value: number) => (value * Math.PI) / 180;
	const R = 6371;

	const [lon1, lat1] = coord1;
	const [lon2, lat2] = coord2;

	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);

	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
};

const permute = <T>(array: T[]): T[][] => {
	if (array.length <= 1) return [array];

	const result: T[][] = [];
	array.forEach((item, i) => {
		const rest = array.slice(0, i).concat(array.slice(i + 1));
		const permutations = permute(rest);
		permutations.forEach(permutation => result.push([item, ...permutation]));
	});

	return result;
}

const calculatePathDistance = (path: Coordinate[]): number => {
	let totalDistance = 0;
	for (let i = 0; i < path.length - 1; i++) {
		totalDistance += haversineDistance(path[i], path[i + 1]);
	}

	return totalDistance;
};

const northPole: Coordinate = [0, 90];

const findShortestPath = (coordinates: Coordinate[]): Coordinate[] => {
	const allPaths = permute(coordinates);

	let shortestPath: Coordinate[] = [];
	let shortestDistance = Infinity;

	for (const path of allPaths) {
		path.unshift(northPole);
		path.push(northPole);

		const distance = calculatePathDistance(path);
		if (distance < shortestDistance) {
			shortestDistance = distance;
			shortestPath = path;
		}
	}

	return shortestPath;
}

const shortestPath = findShortestPath(shopsWithGrøtrisInNorway);
shortestPath.reverse();

const str = shortestPath.map(([lon, lat]) => {
	const round = (n: number) => ((Math.floor(Math.abs(n) * 1000) / 1000) * Math.sign(n)).toFixed(3);
	const processedLon = round(lon);
	const processedLat = round(lat);

	return `(${processedLat},${processedLon})`;
}).join(",");

console.log(str)

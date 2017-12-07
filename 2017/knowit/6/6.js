"use strict";

/**************************
 * Import important stuff *
 **************************/

const fs = require("fs");

/************
 * Solve it *
 ************/

// Start a timer
console.time("Solved");

// Haversine function from https://simplemaps.com/resources/location-distance
function deg2rad(deg){return deg * (Math.PI/180);}
function square(x){return Math.pow(x, 2);}
function getDistanceFromLatLng(lat1, lng1, lat2, lng2) {
	let r=6371; // radius of the earth in km
	lat1=deg2rad(lat1);
	lat2=deg2rad(lat2);
	let lat_dif=lat2-lat1;
	let lng_dif=deg2rad(lng2-lng1);
	let a=square(Math.sin(lat_dif/2))+Math.cos(lat1)*Math.cos(lat2)*square(Math.sin(lng_dif/2));
	let d=2*r*Math.asin(Math.sqrt(a));
	return d;
}

// Define some constants
const oslo = {lat: 59.911491, lon: 10.757933};
const santaSpeed = 7274;	// km/h
const time = 24;	// h
const maxDistance = santaSpeed * time;	// km

// Read and parse the file
const capitolsVisited = fs.readFileSync("verda.txt", "utf-8")
  // Split it into individual lines
  .split("\r\n")
  // Ignore the first (header) line and empty lines
  .filter((line, i) => i > 0 && line !== "")
  // Split it into individual fields and care only about field 6, 12 and 13, which are placetype, lat and lon
  .map((line) => line.split("\t").filter((field, i) => [2, 6, 12, 13].includes(i)))
  // Care only about capitols
  .filter(([name, placeType]) => placeType === "Hovedstad")
  // Get their distances from Oslo in km
  .map(([name, placeType, lat, lon]) => {
	return {
		name,
		distance: getDistanceFromLatLng(oslo.lat, oslo.lon, lat, lon)
	};
  })
  // Sort by nearest
  .sort((a, b) => a.distance - b.distance)
  // Take only unique names
  .filter(({name}, i, arr) => (arr[i+1] !== undefined) ? arr[i+1].name !== name : true)
  // Figure out how many can be visited
  .reduce(({capitolsVisited, totalDistance}, {name, distance}) => {
	// Check if it is within range
	if ((totalDistance + distance) < maxDistance) {
		// Yup. Add it
		totalDistance += distance * 2;	// There and back again
		capitolsVisited++;
	}
	return {capitolsVisited, totalDistance};
  }, {capitolsVisited: 0, totalDistance: 0})
  .capitolsVisited;

// Solved!
console.timeEnd("Solved");
console.log(capitolsVisited);

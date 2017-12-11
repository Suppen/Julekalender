"use strict";

// Start a timer
console.time("Solved");

// Number of people around the table
const n = 1500;

class Person {
	constructor(i) {
		this.i = i;
		this.next = null;
	}
}

// Create the very first person
const firstPerson = new Person(1);

// Create the rest of the persons
let currentPerson = firstPerson;
for (let i = 2; i <= n; i++) {
	const prevPerson = currentPerson;
	currentPerson = new Person(i);
	prevPerson.next = currentPerson;
}

// Connect the last one to the first
currentPerson.next = firstPerson;

// Start knocking people out
currentPerson = firstPerson;
while (currentPerson.next !== currentPerson) {
	const knockedOut = currentPerson.next;
	currentPerson.next = knockedOut.next;
	currentPerson = currentPerson.next;
}

// Solved!
console.timeEnd("Solved");
console.log(currentPerson.i);

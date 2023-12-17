const parseInput = input => {
	const [dimensions, ...rawStrings] = input.split("\n");

	const [width, height] = [...dimensions.matchAll(/\d+/g)].map(match => Number.parseInt(match[0]));

	const strings = rawStrings.map(rawString => {
		const [a, b, c, ...rest] = [...rawString.matchAll(/-?\d+\.\d+/g)].map(match => Number.parseFloat(match[0]));

		const lights = [];
		while (rest.length > 0) {
			const [d, i, r] = rest.splice(0, 3);
			lights.push({ d, i, r });
		}

		return {
			a,
			b,
			c,
			lights
		};
	});

	return {
		width,
		height,
		strings
	};
}

const inputP = fetch("/input.txt")
	.then(res => res.text())
	.then(parseInput);

const canvasP = new Promise(resolve => {
	const listener = () => {
		document.removeEventListener("DOMContentLoaded", listener);

		const canvas = document.querySelector("canvas");
		resolve(canvas);
	};

	document.addEventListener("DOMContentLoaded", listener);
});

const calcY = (a, b, c, x) => (a * x ** 2 + b * x + c)

const pyth = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const draw = (canvas, input) => {
	// Set the canvas size
	canvas.width = input.width;
	canvas.height = input.height;

	// Get the canvas context
	const ctx = canvas.getContext("2d");

	// Fill the background with black
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Process all the strings
	const lengths = Array.from({ length: input.strings.length }, () => 0);
	for (let x = 1; x < canvas.width; x++) {
		for (let i = 0; i < input.strings.length; i++) {
			// Extract the string data
			const { a, b, c, lights } = input.strings[i];

			// Calculate the Y value of this and the previous X
			let prevY = calcY(a, b, c, x - 1);
			let thisY = calcY(a, b, c, x);

			// The canvas Y is inverted
			prevY = canvas.height - prevY;
			thisY = canvas.height - thisY;

			// Calculate the length of the string segment
			lengths[i] += pyth(x - 1, prevY, x, thisY);

			// Check if any light should be drawn on it
			const lightsToDraw = lights.filter(light => light.d <= lengths[i]);

			// Remove them from the light list
			lightsToDraw.map(light => lights.indexOf(light)).forEach(index => lights.splice(index, 1));

			// Draw the lights
			for (const { i, r } of lightsToDraw) {
				ctx.beginPath();
				ctx.arc(x, thisY, r, 0, 2 * Math.PI);
				ctx.fillStyle = `hsl(90deg, 100%, ${i * 100}%)`;
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

draw(await canvasP, await inputP);

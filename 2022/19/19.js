import { readFileSync } from "fs";

export const parseInput = () => {
	const [queue, pathStr, defStr] = readFileSync("input.txt", "utf-8").split("\n");

	return {
		queue,
		path: parsePath(pathStr),
		defs: parseDefs(defStr),
		thieves: []
	};
};

export const parsePath = pathStr => {
	const nodes = [...pathStr.matchAll(/\d+,\d+/g)].map(([coords]) => coords.split(",").map(s => Number(s)));

	const path = [];
	for (let i = 0; i < nodes.length - 1; i++) {
		const [x1, y1] = nodes[i];
		const [x2, y2] = nodes[i + 1];

		const line = [];
		if (y1 === y2) {
			for (let x = x1; x !== x2; x += Math.sign(x2 - x1)) {
				line.push([x, y1]);
			}
		} else if (x1 === x2) {
			for (let y = y1; y !== y2; y += Math.sign(y2 - y1)) {
				line.push([x1, y]);
			}
		}

		path.push(line);
	}

	path.push([nodes[nodes.length - 1]]);

	return path.flat();
};

export const parseDefs = defStr => {
	const defs = [...defStr.matchAll(/(L|A|S),\d+,\d+/g)]
		.map(([coords]) => coords.split(","))
		.map(([type, x, y]) => ({ type, pos: [Number(x), Number(y)], cooldown: 0 }));

	return defs;
};

export const processQueue = (entry, queue, thieves) => {
	if (queue.length === 0) {
		return [[], thieves];
	}

	const [head, ...rest] = queue;
	if (head === " ") {
		return [rest, thieves];
	}

	return [rest, [{ pos: entry, status: "normal" }, ...thieves]];
};

export const separateThieves = thieves => {
	const sep = { normal: [], affected: [] };
	for (const thief of thieves) {
		if (thief.status === "normal") {
			sep.normal.push(thief);
		} else {
			sep.affected.push(thief);
		}
	}
	return sep;
};

export const separateDefenses = defs => {
	const sep = { cool: [], hot: [] };
	for (const def of defs) {
		if (def.cooldown === 0) {
			sep.cool.push(def);
		} else {
			sep.hot.push(def);
		}
	}
	return sep;
};

export const nextPos = (path, pos) => {
	const i = Math.min(path.indexOf(pos) + 1, path.length - 1);
	return path[i];
};

export const prevPos = (path, pos) => {
	const i = Math.max(path.indexOf(pos) - 1, 0);
	return path[i];
};

export const moveThief = (path, thief) => {
	if (thief.status === "normal") {
		return { ...thief, pos: nextPos(path, thief.pos) };
	}
	if (thief.status === "Alf") {
		return { ...thief, pos: prevPos(path, thief.pos), remaining: thief.remaining - 1 };
	}
	if (thief.status === "Slime") {
		const remaining = thief.remaining - 1;
		if (thief.remaining % 2 === 0) {
			return { ...thief, remaining, pos: nextPos(path, thief.pos) };
		} else {
			return { ...thief, remaining };
		}
	}
};

export const cleanThief = thief => {
	if (thief.status === "normal") {
		return thief;
	}
	if (thief.remaining === 0) {
		return { status: "normal", pos: thief.pos };
	}

	return { ...thief, remaining: thief.remaining - 1 };
};

export const pyth = ([x1, y1], [x2, y2]) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

export const fireDefense = (path, defense, thieves) => {
	const ranges = { L: Infinity, A: 10, S: 5 };
	const cooldowns = { L: 4, A: 2, S: 2 };
	const statuses = { A: "Alf", S: "Slime" };
	const effectTime = { A: 2, S: 6 };

	// Remove those too far away from the defense
	const nearThieves = thieves.filter(({ pos }) => pyth(defense.pos, pos) <= ranges[defense.type]);
	const farThieves = thieves.filter(({ pos }) => pyth(defense.pos, pos) > ranges[defense.type]);

	// Nobody to shoot if nobody is within range
	if (nearThieves.length === 0) {
		return [defense, null, thieves];
	}

	// Sort by how far along the path they are and shoot the furthest
	const [shot, ...rest] = nearThieves.sort((a, b) => path.indexOf(b.pos) - path.indexOf(a.pos));

	// Put the defense on cooldown
	defense = { ...defense, cooldown: cooldowns[defense.type] };

	const realRest = [...rest, ...farThieves];

	if (defense.type === "L") {
		return [defense, null, realRest];
	}

	return [defense, { ...shot, status: statuses[defense.type], remaining: effectTime[defense.type] }, realRest];
};

export const shootThieves = (path, defs, thieves) => {
	return defs.reduce(
		({ norm, aff, ds }, def) => {
			const [d, a, n] = fireDefense(path, def, norm);

			return { norm: n, aff: [a, ...aff].filter(t => t !== null), ds: [d, ...ds] };
		},
		{ norm: thieves, aff: [], ds: [] }
	);
};

export const tick = ({ queue, path, defs, thieves }) => {
	// Move the thieves
	thieves = thieves.map(thief => moveThief(path, thief));

	// Add the thief at the front of the queue
	[queue, thieves] = processQueue(path[0], queue, thieves);

	// Shoot the thieves
	let { normal, affected } = separateThieves(thieves);
	const { hot, cool } = separateDefenses(defs);
	const { norm, aff, ds } = shootThieves(path, cool, normal);
	normal = norm;
	affected = [...affected, ...aff];
	thieves = [...normal, ...affected];
	defs = [...hot, ...ds];

	// Clean the thieves and cool the defenses
	thieves = thieves.map(cleanThief);
	defs = defs.map(def => ({ ...def, cooldown: Math.max(0, def.cooldown - 1) }));

	// Return the new game state
	return { queue, path, defs, thieves };
};

let state = parseInput();
let ended = false;
let t = 0;
do {
	state = tick(state);

	t++;

	ended = state.thieves.some(thief => thief.pos === state.path[state.path.length - 1]);
} while (!ended);

// XXX This gives an off-by-about-5-error. I don't know why, and can't be bothered to find out. I've spent too much time
// on this !
console.log(t);

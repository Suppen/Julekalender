import { readFileSync } from "fs";

type Hand = "left" | "right";

type GraphNode = {
	x: number;
	y: number;
	hand: Hand;
	edges: GraphNode[];
};

type Graph = Map<number, Map<number, Map<Hand, GraphNode>>>;

const getNode = (graph: Graph, x: number, y: number, hand: Hand): GraphNode | null => graph.get(x)?.get(y)?.get(hand) ?? null;
const createNodes = (graph: Graph, x: number, y: number): void => {
	const ys = graph.get(x) ?? new Map();
	const hands = new Map();

	hands.set("left", { x, y, hand: "left", edges: [] });
	hands.set("right", { x, y, hand: "right", edges: [] });

	ys.set(y, hands);
	graph.set(x, ys);
};
const getNodes = (graph: Graph): GraphNode[] => [...graph.values()].flatMap(ys => [...ys.values()].flatMap(y => [...y.values()]));

const distanceBetween = (a: GraphNode, b: GraphNode): number => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const graph: Graph = readFileSync("grep.txt", "utf-8")
	.split("\n")
	.filter((l: string) => l.length > 0)
	.map((l: string) => l.split(" "))
	.map(([y, x]) => [parseInt(x), parseInt(y)])
	.reduce((graph: Graph, [x, y]) => {
		createNodes(graph, x, y);
		return graph;
	}, new Map());

type HandDeltas = { x: number; y: number }[];

const parseHand = (str: string): HandDeltas => {
	const chars = str.split("\n").map(l => l.split(""));

	let o: { x: number; y: number };
	const points: { x: number; y: number }[] = [];

	for (let y = 0; y < chars.length; y++) {
		for (let x = 0; x < chars[y].length; x++) {
			if (chars[y][x] === 'x') {
				points.push({ x, y });
			} else if (chars[y][x] === 'o') {
				o = { x, y };
			}
		}
	}

	return points.map(({ x, y }) => ({ x: x - o.x, y: o.y - y }));
};

const leftHand = parseHand(
	`        xxx
      xxxxxxx
     xxxxxxxxx
    xxxxxxxxxxx
   xxxxxxxxxxxx
  xxxxxxxxxxxxx
  xxxxxxxxxxxxx
 xxxxxxxxxxxxx
 xxxxxxxxxxxx
          o`);

const rightHand = parseHand(
	`      xxx
    xxxxxxx
   xxxxxxxxx
  xxxxxxxxxxx
  xxxxxxxxxxxx
  xxxxxxxxxxxxx
  xxxxxxxxxxxxx
   xxxxxxxxxxxxx
    xxxxxxxxxxxx
      o`);

const connectGraph = (graph: Graph, leftHand: HandDeltas, rightHand: HandDeltas): void => {
	const allNodes = getNodes(graph);
	const leftNodes = allNodes.filter(n => n.hand === "left");
	const rightNodes = allNodes.filter(n => n.hand === "right");

	for (const node of rightNodes) {
		for (const { x: dx, y: dy } of leftHand) {
			const reachableNode = getNode(graph, node.x + dx, node.y + dy, "left");
			if (reachableNode !== null) {
				node.edges.push(reachableNode);
			}
		}
	}
	for (const node of leftNodes) {
		for (const { x: dx, y: dy } of rightHand) {
			const reachableNode = getNode(graph, node.x + dx, node.y + dy, "right");
			if (reachableNode !== null) {
				node.edges.push(reachableNode);
			}
		}
	}
}

connectGraph(graph, leftHand, rightHand);

const shortestPath = (startNode: GraphNode, endNode: GraphNode) => {
	const visited = new Set<GraphNode>();
	const toProcess = new Set<GraphNode>([startNode]);
	const dist = new Map<GraphNode, number>([[startNode, 0]]);
	const prev = new Map<GraphNode, GraphNode>();

	while (toProcess.size > 0) {
		let current: GraphNode | undefined = undefined;
		for (const node of toProcess) {
			if (current === undefined) {
				current = node;
			} else if ((dist.get(node) ?? Infinity) < (dist.get(current) ?? Infinity)) {
				current = node;
			}
		}
		if (current === undefined) {
			throw new Error("No path found");
		}
		const currentDist = dist.get(current) ?? Infinity;
		if (currentDist === Infinity) {
			throw new Error("No path found");
		}

		for (const neighbour of current.edges) {
			const oldDist = dist.get(neighbour) ?? Infinity;
			const newDist = currentDist + distanceBetween(current, neighbour);
			if (newDist < oldDist) {
				dist.set(neighbour, newDist);
				prev.set(neighbour, current);
			}
			if (!visited.has(neighbour)) {
				toProcess.add(neighbour);
			}
		}

		toProcess.delete(current);
		visited.add(current);

		if (current === endNode) {
			break;
		}
	}

	if (!prev.has(endNode)) {
		throw new Error("No path found");
	}

	return dist;
}

const startNode = getNode(graph, 250, 0, "right")!;
const endNode = getNode(graph, 749, 999, "right")!;

const dist = shortestPath(startNode, endNode);

console.log(Math.round(dist.get(endNode)! * 10));

const segments = ["A", "B", "C", "D", "E", "F", "G"] as const;
type Segment = typeof segments[number];
type SegmentNumber = [Set<Segment>, Set<Segment>, Set<Segment>, Set<Segment>, Set<Segment>, Set<Segment>];

const setsAreEqual = <T>(a: Set<T>, b: Set<T>): boolean => {
	if (a.size !== b.size) {
		return false;
	}
	for (const element of a) {
		if (!b.has(element)) {
			return false;
		}
	}
	return true;
}

const segmentNumbersAreEqual = (a: SegmentNumber, b: SegmentNumber): boolean => {
	for (let i = 0; i < 6; i++) {
		if (!setsAreEqual(a[i], b[i])) {
			return false;
		}
	}
	return true;
}

const sevenSegmentDigits = new Map<number, Set<Segment>>([
	[0, new Set(["A", "B", "C", "D", "E", "F"])],
	[1, new Set(["B", "C"])],
	[2, new Set(["A", "B", "G", "E", "D"])],
	[3, new Set(["A", "B", "G", "C", "D"])],
	[4, new Set(["F", "G", "B", "C"])],
	[5, new Set(["A", "F", "G", "C", "D"])],
	[6, new Set(["A", "F", "G", "E", "C", "D"])],
	[7, new Set(["A", "B", "C"])],
	[8, new Set(["A", "B", "C", "D", "E", "F", "G"])],
	[9, new Set(["A", "B", "C", "D", "F", "G"])]
]);

const digits = (n: number): number[] => n.toString().split("").map(d => Number(d));

const shuffle = (array: number[]): number[] => array.sort(() => Math.random() - 0.5);

const numberToSegments = (n: number): SegmentNumber => {
	let segments = digits(n).map(d => sevenSegmentDigits.get(d)!);

	while (segments.length < 6) {
		segments.unshift(sevenSegmentDigits.get(0)!);
	}

	return segments as unknown as SegmentNumber;
};

const grinchMess = [
	[[5, "C"], [0, "B"]],
	[[4, "D"], [1, "G"]],
	[[3, "F"], [2, "E"]],
	[[4, "A"], [4, "B"]]
] as const;
const messUpNumber = (segmentNumber: SegmentNumber): SegmentNumber => {
	const messedUpNumber = segmentNumber.map(s => new Set(s));

	for (const [[digitA, segmentA], [digitB, segmentB]] of grinchMess) {
		if (segmentNumber[digitA].has(segmentA)) {
			messedUpNumber[digitB].add(segmentB);
		} else {
			messedUpNumber[digitB].delete(segmentB);
		}
		if (segmentNumber[digitB].has(segmentB)) {
			messedUpNumber[digitA].add(segmentA);
		} else {
			messedUpNumber[digitA].delete(segmentA);
		}
	}

	return messedUpNumber as unknown as SegmentNumber;
}

let areSame = 0;
for (let n = 0; n <= 999_999; n++) {
	const segmentNumber = numberToSegments(n);
	if (segmentNumbersAreEqual(segmentNumber, messUpNumber(segmentNumber))) {
		areSame++;
	}
}

console.log(areSame * 1000);

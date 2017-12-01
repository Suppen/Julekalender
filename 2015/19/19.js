function takeSteps(stepSum) {
	if (stepSum == 0) {
		return 1;
	}
	if (stepSum < 0) {
		return 0;
	}
	return takeSteps(stepSum-1) + takeSteps(stepSum-2) + takeSteps(stepSum-3);
};
console.log(takeSteps(30));

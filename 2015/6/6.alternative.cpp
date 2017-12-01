#include <iostream>
using namespace std;

int combs(int rem, int open = 0) {
	// Base case
	if (rem + open == 0) {
		return 1;
	}

	// Recursive part
	int count = 0;
	if (rem > 0) {
		count += combs(rem-1, open+1);
	}
	if (open > 0) {
		count += combs(rem, open-1);
	}
	return count;
}

int main(int argc, char** argv) {
	cout << combs(13) << endl;
}

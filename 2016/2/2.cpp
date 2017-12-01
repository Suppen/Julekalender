#include <iostream>
#include <ctime>
using namespace std;

int main(int argc, char** argv) {
	clock_t begin = clock();

	unsigned long a = 0, b = 1, c = 1;

	unsigned long sum = 0;

	while (c < 4000000000l) {
		a = b;
		b = c;
		c = a+b;
		if (c & 1 != 0) {
			sum += c;
		}
	}

	clock_t end = clock();

	cout << (sum - c) << endl;

	double elapsed_secs = double(end - begin) / CLOCKS_PER_SEC;
	cout << elapsed_secs << endl;
}

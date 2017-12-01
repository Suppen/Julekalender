#include <iostream>
#include <ctime>
using namespace std;

int main(int argc, char** argv) {
	clock_t begin = clock();
	int i = 6;
	double currentPow = 1;
	int n;
	double p = 10;
	do {
		if (i > p) {
			currentPow++;
			p *= 10;
			i = 6;
		}
		n = i + p;
		i += 10;
	} while ((6 * p + (n-6)/10) / n != 4);
	cout << n << endl;
	clock_t end = clock();
	double elapsed_secs = double(end - begin) / CLOCKS_PER_SEC;
	cout << elapsed_secs << endl;
}

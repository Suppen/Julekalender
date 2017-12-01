#include <iostream>
#include <ctime>
using namespace std;

int main() {
	clock_t begin = clock();

	cout << 3*(1000000000000000l-1) << endl;

	clock_t end = clock();

	double elapsed_secs = double(end - begin) / CLOCKS_PER_SEC;
	cout << elapsed_secs << endl;
}

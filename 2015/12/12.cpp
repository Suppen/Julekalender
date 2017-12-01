#include <iostream>
using namespace std;

int main(int argc, char** argv) {
	int up_to = 100000000;
	unsigned long sum = 0;
	for (int i = 7; i < up_to; i += 7) {
		sum += i;
	}
	for (int i = 5*7; i < up_to; i += 5*7) {
		sum -= i;
	}
	cout << sum << endl;
}

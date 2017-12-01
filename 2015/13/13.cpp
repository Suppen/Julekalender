#include <iostream>
#include <cmath>
#include <algorithm>
using namespace std;

unsigned long long up_to = 900719925474099100l;

int main(int argc, char** argv) {
	long amount = 0;

	long* knalls = new long[10837];

	long fives = 0;
	long fiveProd = 1;
	do {
		long threes = 0;
		long threeProd = 1;
		do {
			long twos = 0;
			long twoProd = 1;
			do {
				knalls[amount++] = twoProd * threeProd * fiveProd;
				twos++;
				twoProd = pow(2, twos);
			} while (twoProd * threeProd * fiveProd <= up_to);
			threes++;
			threeProd = pow(3, threes);
		} while (threeProd * fiveProd <= up_to);
		fives++;
		fiveProd = pow(5, fives);
	} while (fiveProd <= up_to);

	sort(knalls, knalls+10837);

	cout << knalls[9999] << endl;
}

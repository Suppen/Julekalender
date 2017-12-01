#include <iostream>
#include <cmath>
#include <string>
using namespace std;

unsigned long long countDigits(string n, int d) {
	int power = n.length() - 1;
	int digit = (int) (n[0] - '0');
	if (power == 0) {
		return digit >= d ? 1 : 0;
	}

	string restdigits = n.substr(1);

	unsigned long long a = power * pow(10, power-1) * digit;
	a += countDigits(restdigits, d);
	if (digit == d) {
		a += stol(restdigits)+1;
	} else if (digit > d) {
		a += pow(10, power);
	}
	return a;
}

int main(int argc, char** argv) {
	string n = "12345678987654321";

	cout << countDigits(n, 2) << endl;
}

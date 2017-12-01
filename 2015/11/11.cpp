#include <iostream>
#include <fstream>
#include <string>
#include <algorithm>
#include <tuple>
#include <ctime>
using namespace std;

bool compare(const tuple<string, int>& a, const tuple<string, int>& b) {
	return get<1>(a) > get<1>(b);
}

int main(int argc, char** argv) {
	clock_t begin_time = clock();

	tuple<string, int>* romans = new tuple<string, int>[13];
	romans[0] = tuple<string, int>("M", 1000);
	romans[1] = tuple<string, int>("CM", 900);
	romans[2] = tuple<string, int>("D", 500);
	romans[3] = tuple<string, int>("CD", 400);
	romans[4] = tuple<string, int>("C", 100);
	romans[5] = tuple<string, int>("XC", 90);
	romans[6] = tuple<string, int>("L", 50);
	romans[7] = tuple<string, int>("XL", 40);
	romans[8] = tuple<string, int>("X", 10);
	romans[9] = tuple<string, int>("IX", 9);
	romans[10] = tuple<string, int>("V", 5);
	romans[11] = tuple<string, int>("IV", 4);
	romans[12] = tuple<string, int>("I", 1);

	tuple<string, int>* numbers = new tuple<string, int>[10001];

	ifstream file("11.txt");
	string line;
	int i = 0;
	int value;
	while (file >> line) {
		if (line[1] == 'b') {
			value = stoi(line.substr(2), NULL, 2);
		} else if (line[0] <= '9') {
			value = stoi(line);
		} else {
			value = 0;
			string roman = line;
			while (roman != "") {
				for (int i = 0; i < 13; i++) {
					if (roman.find(get<0>(romans[i])) == 0) {
						value += get<1>(romans[i]);
						roman = roman.substr(get<0>(romans[i]).length());
						break;
					}
				}
			}
		}

		tuple<string, int> number(line, value);
		numbers[i++] = number;
	}

	sort(numbers, numbers+10001, compare);
	cout << get<0>(numbers[5000]) << " " << get<1>(numbers[5000]) << endl;

	clock_t end_time = clock();
	cout << "Time used: " << float(end_time - begin_time) / CLOCKS_PER_SEC << " seconds" << endl;
};

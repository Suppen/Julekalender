#include <iostream>
#include <algorithm>
using namespace std;

int main(int argc, char** argv) {
	// Make an array to hold parentheses
	int number_of_paren_pairs = 13;
	int number_of_parens = number_of_paren_pairs*2;
	int* parens = new int[number_of_parens];

	// Fill it with correct values
	for (int i = 0; i < number_of_paren_pairs; i++) {
		parens[i] = 1;	// Opening paren
		parens[i + number_of_paren_pairs] = -1; // Close paren
	}

	// Permute the shit out of it
	int valid_permutations = 0;
	do {
		int open_parens = 0;
		for (int j = 0; j < number_of_parens && open_parens >= 0; j++) {
			open_parens += parens[j];
		}
		if (open_parens == 0) {
			valid_permutations++;
		}

		// Permute it
		do {
			prev_permutation(parens, parens+number_of_parens);
		} while (parens[number_of_parens-1] == 1);
	} while (parens[0] == 1);

	cout << valid_permutations << endl;

	delete[] parens;
}

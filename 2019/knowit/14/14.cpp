#include <iostream>

int elf_sequence(const int alphabet_length, const char* alphabet, const int length) {
	// Find the highest letter in the alphabet
	char highest = 0;
	for (int i = 0; i < alphabet_length; i++) {
		if (alphabet[i] > highest) {
			highest = alphabet[i];
		}
	}

	// Create the sequence with the initial letters, plus a bit more
	auto sequence = new char[length + highest];
	for (int i = 0; i < alphabet[0]; i++) {
		sequence[i] = alphabet[0];
	}

	// Generate the sequence
	int i = 1;
	int n = alphabet[0];
	int sum = 0;
	while (n < length) {
		auto letter = alphabet[i % alphabet_length];
		if (letter == 7) {
			sum += 7 * sequence[i];
		}
		for (int j = 0; j < sequence[i]; j++) {
			sequence[n++] = letter;
		}
		i++;
	}

	delete[] sequence;

	return sum;
}

int main(int argc, char** argv) {
	int sequence_length = 217532235;
	int alphabet_length = 5;
	char alphabet [alphabet_length] = { 2, 3, 5, 7, 11 };
	auto sum = elf_sequence(alphabet_length, alphabet, sequence_length);

	std::cout << sum << std::endl;
}

#include <iostream>

int digit_sum(int n) {
	int sum = 0;
	while (n > 0) {
		sum += n % 10;
		n = n / 10;
	}

	return sum;
}

bool is_prime(int n) {
        if (n == 1) return false;
        if (n < 4) return true;
        if (n % 2 == 0) return false;
        if (n % 3 == 0) return false;

        int i = 5;
        int w = 2;

        while (i * i <= n) {
                if (n % i == 0) return false;
                i += w;
                w = 6 - w;
        }
        return true;
}

bool is_harshad(int n) {
	int ds = digit_sum(n);
	return is_prime(ds) && n % ds == 0;
}

int main(int argc, char** argv) {
	int limit = 98765432;

	int count = 0;
	for (int n = 1; n <= limit; n++) {
		if (is_harshad( n)) {
			count++;
		}
	}

	std::cout << count << std::endl;
}

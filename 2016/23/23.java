import java.math.BigInteger;

class Luke23 {
	public static void main(String[] args) {
		int n = 250;
		if (args.length == 1) {
			n = Integer.parseInt(args[0]);
		}
		System.out.println(tribonacci(n));
	}

	public static BigInteger tribonacci(int n) {
		BigInteger a = BigInteger.ZERO;
		BigInteger b = BigInteger.ZERO;
		BigInteger c = BigInteger.ONE;
		for (int k = 0; k < n; k++) {
			BigInteger d = a.add(b).add(c);
			a = b;
			b = c;
			c = d;
		}
		return c;
	}
}

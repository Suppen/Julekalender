import java.util.Arrays;

public class ManachersAlgorithm {
    
    public static int[] findLongestPalindrome(String s) {
        if (s==null || s.length()==0)
            return new int[0];
        
        char[] s2 = addBoundaries(s.toCharArray());
        int[] p = new int[s2.length]; 
        int c = 0, r = 0; // Here the first element in s2 has been processed.
        int m = 0, n = 0; // The walking indices to compare if two elements are the same
        for (int i = 1; i<s2.length; i++) {
            if (i>r) {
                p[i] = 0; m = i-1; n = i+1;
            } else {
                int i2 = c*2-i;
                if (p[i2]<(r-i-1)) {
                    p[i] = p[i2];
                    m = -1; // This signals bypassing the while loop below. 
                } else {
                    p[i] = r-i;
                    n = r+1; m = i*2-n;
                }
            }
            while (m>=0 && n<s2.length && s2[m]==s2[n]) {
                p[i]++; m--; n++;
            }
            if ((i+p[i])>r) {
                c = i; r = i+p[i];
            }
        }
        int len = 0; c = 0;
        for (int i = 1; i<s2.length; i++) {
            if (len<p[i]) {
                len = p[i]; c = i;
            }
        }
        return p;
//        char[] ss = Arrays.copyOfRange(s2, c-len, c+len+1);
//        return String.valueOf(removeBoundaries(ss));
    }
 
    public static char[] addBoundaries(char[] cs) {
        if (cs==null || cs.length==0)
            return "||".toCharArray();

        char[] cs2 = new char[cs.length*2+1];
        for (int i = 0; i<(cs2.length-1); i = i+2) {
            cs2[i] = '|';
            cs2[i+1] = cs[i/2];
        }
        cs2[cs2.length-1] = '|';
        return cs2;
    }

    public static char[] removeBoundaries(char[] cs) {
        if (cs==null || cs.length<3)
            return "".toCharArray();

        char[] cs2 = new char[(cs.length-1)/2];
        for (int i = 0; i<cs2.length; i++) {
            cs2[i] = cs[i*2+1];
        }
        return cs2;
    }    
}
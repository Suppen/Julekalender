import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;

public class Luke16 {
	public static void main(String[] args) throws Exception {
		String content = Files.readString(Paths.get("input.txt"));
		
		content = content.replaceAll(",", "");
		
		int[] result = ManachersAlgorithm.findLongestPalindrome(content);
	
		System.out.println(Arrays.toString(result));
	}
}

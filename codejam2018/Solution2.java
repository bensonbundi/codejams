package codejam2018;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;


public class Solution2 {
	
	public static void main(String args[]) {
		
		
		List<String> results = new ArrayList<>();
		Scanner input = new Scanner(System.in);
		int T =  Integer.parseInt(input.nextLine());
		for (int test = 1; test <= T; test++) {
			int a = Integer.parseInt(input.nextLine());
			String b = input.nextLine();
			int[] num = Arrays.stream(b.split(" ")).mapToInt(Integer::parseInt).toArray();
	
			solve(test,num);
		}
}
	
	
	
	
	static void solve(Integer test,  int [] integers) {

		System.out.println( "Case #" + test +": " + trebleSort(integers));
	}
	static String trebleSort( int [] integers){
		boolean done = false;
		while (!done){
			done=true;
			for (int i=0;i<integers.length-2;i++){
				if(integers[i] > integers[i+2]){
					int temp =integers[i];
					integers[i]=integers[i+2];
					integers[i+2] =temp;
					done=false;
				}
			}
			if(done == true){
				//check sorted
				for (int i=0;i<integers.length-1;i++){
					if(integers[i] > integers[i+1])
					{
						return  Integer.toString(i);
					}
				}
			}
		}
	return "OK";
	}
}
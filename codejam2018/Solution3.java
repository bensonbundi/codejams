package codejam2018;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Solution3 {
	



	private Integer rows = 0;
	private Integer cols = 0;
	private boolean finished = false;
	private boolean[][] plot = new boolean[1000][1000];
	
	private boolean surroundingReady(Integer x, Integer y) {

		return plot[x-1][y-1] &&
				plot[x-1][y] &&
				plot[x-1][y+1] &&
				plot[x][y-1] &&
				plot[x][y] &&
				plot[x][y+1] &&
				plot[x+1][y-1] &&
				plot[x+1][y] &&
				plot[x+1][y+1];
	}
	private void deployGopher(Scanner in) {

		Integer x;
		Integer y = 1;
		boolean found = false;
		//Search for cell to prepare
		for (x = 1; x < rows - 1; x++) {
			for (y = 1; y < cols - 1; x++) {
				if (!surroundingReady(x, y)) {
					found = true;
					break;
				}
			}
			if (found) break;
		}
		x++;y++;
		if (!found) {
			//print("Error on testcase " + testCastNumber + " could not locate free cell (" + x + "," +y+")");
			System.exit(1);
		}


		System.out.println(x.toString() + " " + y.toString());
		System.out.flush();

		String output = (in.nextLine());
		Integer i = Integer.parseInt(output.split(" ")[0]);
		Integer j = Integer.parseInt(output.split(" ")[1]);
		if (j == 0 && i == 0) {
			//System.err.print("Finished testcase " + testCastNumber);
			finished = true;
			return;
		}
		if (j == -1 && i == -1) {
			//print("Error on testcase " + testCastNumber);
			System.exit(2);
		}
		plot[i - 1][j - 1] = true;

	}


	
	
	
	public static void main(String args[]) {
	
		Solution3 sol = new Solution3();
		
		Scanner input = new Scanner(System.in);
		int T = Integer.parseInt(input.nextLine());
		for (int testCastNumber = 1; testCastNumber <= T; testCastNumber++) {
			Integer A = Integer.parseInt(input.nextLine());
			sol.solve(testCastNumber, A, input);

		}

	}
	
 void solve(Integer testCastNumber, Integer requiredCells, Scanner in) {

	 rows  = 0;
	 cols = 0;
	 finished = false;
	 plot = new boolean[1000][1000];

		Double squareRoot = Math.sqrt(requiredCells);
		if (squareRoot <= 3) {
			rows = 3;
			cols = 3;
		} else if (squareRoot.intValue() * squareRoot.intValue() == requiredCells.doubleValue()) {
		
			rows = squareRoot.intValue();
			cols = squareRoot.intValue();
		} else {
			rows = squareRoot.intValue();
			cols = squareRoot.intValue() + 1;
		}
		
		while (!finished) {
			deployGopher(in);
		}

	}
}
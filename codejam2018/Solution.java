package codejam2018;

import java.util.Scanner;

public class Solution {
  public static void solve(int test, String s, int limit) {
   
	  double damage = damage(s);
	  if(limit>=damage) {
		  System.out.println("Case #"+ test +": 0");
		  return;
	  }
	  
	  
	  long count = 0;
		 String ss = s;
		
	   Object[] res = null;
	   do {
		 res = swap(ss);
		ss = (String)res[1];
		damage -= (double)res[2];
		 if((boolean)res[0]) {
			 count +=1;
		 }
		 
		 if(limit>=damage) {//damage(ss)
			  System.out.println("Case #"+ test +": " +count);
			  return;
		  }

		   
	   }while((boolean)res[0]);
	   
	   
	   System.out.println("Case #"+ test +": IMPOSSIBLE");

	  
  }

  static Object[] swap(String s) {
	  char arr[] = s.toCharArray();

	  boolean swapped =false;
	  Object[] res = {swapped,s,0d};
	  for (int i = s.length()-1; i > 0; i--){
		  
		  if(arr[i]=='S' && arr[i-1]!='S') {
			  //char tmp = arr[i];
			    arr[i] = arr[i-1];
			    arr[i-1] = 'S';
			    
			    //count saved damage:
			   int power= s.substring(0 , i-1).length() - s.substring(0 , i-1).replace("C", "").length();
			    
			   double saved =  Math.pow(2,power+1) - Math.pow(2,power);
			    
			    Object[] r = {true,new String(arr),saved}; 
			    return r;
			    
		    }
	  }
	  
	  return res;
	    
  }

   static double damage(String s) {
	   double damage = 0;
	   long p = 0;
	  for (int i = 0; i < s.length(); i++){
		    char c = s.charAt(i);        
		    if(c=='C') {
		    	p +=1;
		    }else {
		    	damage += Math.pow(2,p);
		    	//p=0;
		    }
		}
	  return damage;
	  }
  
  public static void main(String args[]) {
    Scanner input = new Scanner(System.in);
    int T = input.nextInt();
    for (int i = 1; i <= T; i++) {
      int a = input.nextInt();
      String in = input.next();
     // System.out.println(a);
     // System.out.println(in);
     // System.out.println(damage(in));
      solve(i,in, a );
    }
  }
}

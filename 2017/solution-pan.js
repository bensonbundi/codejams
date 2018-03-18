 /*
to run:
 node solution.js < small.in

 
 //b_should_be_easy.in findRichestRides(findClosestToStartRides trim:1 splice 2 bonus: 25 earnings: 176877 trips: 300 out of 300 lateDrop: 2 lateStart: 12
 material:
https://www.topcoder.com/community/data-science/data-science-tutorials/greedy-is-good/
*/
process.stdin.resume();
process.stdin.setEncoding('ascii');

console.time("script");

var input_stdin = "";
var input_stdin_array = "";
var input_currentline = 0;




process.stdin.on('data', function (data) {
    input_stdin += data;
});

process.stdin.on('end', function () {
    input_stdin_array = input_stdin.split("\n");
    main();   
});

function readLine() {
    return input_stdin_array[input_currentline++];
}

/////////////// ignore above this line ////////////////////

let flipper =0;

function main() {

	let t = parseInt(readLine());
	console.log(t)
	
	let sol ="";
	for(let i=0;i<t;i++){
		console.log(i)
		let lines = readLine();
		let arr = lines.split(" ")
		let pancake = arr[0];
		flipper = parseInt(arr[1]);
		
		let ans = flipit(i,pancake)
		sol = sol + ans + "\n"
	}
	eureka(sol)
	

	
	
}
function test(){
		flipper = 2
		let ans = flipit(0,"++-+")
		eureka(ans)
	
}
function flipit(index,pancake){
	
	let origi = pancake;
	let size = pancake.length;
		//find the first -
		
		let prevIndex =-1
		let flipcount =0;
		let a = pancake.indexOf("-")
		do{
			a = pancake.indexOf("-")
			
			if(a < 0){//we r done flipping
					return origi + flipper + `case #${index + 1}: ` + `${flipcount}`
			}
			
			
			if(prevIndex>a){ // looping back cant solve this
				return origi +flipper + `case #${index + 1}: ` + "IMPOSSIBLE"
			}
			
			prevIndex = a;
			
			
			if(a + flipper <=size){ // we can flip b4 hitting edge
				flipcount +=1;
				let flip = pancake.slice(0,a)
				
				for(i=a;i<flipper;i++){
					//pancake[i] = pancake[i]=='-'?'+':'-'
					flip += pancake[i]=='-'?'+':'-';
				}
				flip += pancake.slice(a+flipper)
				pancake = flip
			//	console.log(pancake)
				//flipit(pancake)
			}else{ //we cant flip anymore. fail
				return origi + flipper + `case #${index + 1}: ` + "IMPOSSIBLE"
			}
			
			
		}while (a > -1)
		return origi + flipper + `case #${index + 1}: ` + `${flipcount}`
		
}

function eureka(sol){
	console.log('-------------eureka---------------')

	console.log(sol)
	console.timeEnd("script")
	var fs = require('fs');
	fs.writeFileSync("1.out", sol);
	process.exit()
}



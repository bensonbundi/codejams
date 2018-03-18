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


	let r = 0; //● R – number of rows of the grid (1 ≤ R ≤ 10000)
	let c = 0; //● C – number of columns of the grid (1 ≤ C ≤ 10000)
	let f = 0;//● F – number of vehicles in the fleet (1 ≤ F ≤ 1000)
	let n = 0;//● N – number of rides (1 ≤ N ≤ 10000)
	let bonus = 0; //● B – per-ride bonus for starting the ride on time (1 ≤ B ≤ 10000)
	let t = 0;//● T – number of steps in the simulation (1 ≤ T ≤ 10 )
	let clock = 0
	let fleet = [] //ride{x,y,trips:[]}
	let transit = []
	let possibleSolutions = new Map();
	let bestDepth;
	let optimisedLoopLimit = 50;
	let origigrid = []
	let ridesAvailables = []
	let ridesInProgress = [];
	let GREED =0;

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

function main() {
	
	//3 5 1 6 TTTTT TMMMT TTTTT 
//3 rows, 5 columns, min 1 of each ingredient per slice, max 6 cells per slice 
	
	let lines = readLine();
	let arr = lines.split(" ")
	
	 
	r = parseInt(arr[0]); //● R – number of rows of the grid (1 ≤ R ≤ 10000)
	c = parseInt(arr[1]); //● C – number of columns of the grid (1 ≤ C ≤ 10000)
	f = parseInt(arr[2]);//● F – number of vehicles in the fleet (1 ≤ F ≤ 1000)
	n = parseInt(arr[3]);//● N – number of rides (1 ≤ N ≤ 10000)
	bonus = parseInt(arr[4]); //● B – per-ride bonus for starting the ride on time (1 ≤ B ≤ 10000)
	t = parseInt(arr[5]);//● T – number of steps in the simulation (1 ≤ T ≤ 10 )
	
	console.log(lines)
	console.log('---------------------------------')
	//create grid of map
	for(i=0;i<c;i++){
		origigrid[i] = [] //createArray(r,1) //[Array.apply([], { length: r })] //new Array(r)
	}

	for(i=0;i<f;i++){
		fleet.push({id:i,x:0,y:0,status:'f'}) //f b d -free,booked,driving 
	}
	
	for(i=0;i<n;i++){
		let str =readLine()
		each = str.split(" ");//.slice(0,-1);
		each = each.map(e=>Number.parseInt(e))
		/*
		0 a – the row of the start intersection (0 ≤ a < R)
		1 b – the column of the start intersection (0 ≤ b < C)
		2 x – the row of the finish intersection (0 ≤ x < R)
		3 y – the column of the finish intersection (0 ≤ y < C)
		4 s – the earliest start(0 ≤ s < T)
		5 f – the latest finish (0 ≤ f ≤ T) , (f ≥ s + |x − a| + |y − b|)
		grid[]
		
		*/
		var ride = {id:i,sx:each[0],sy:each[1],fx:each[2],fy:each[3],s:each[4],f:each[5],status:'f'} //f,b,d,a pendin bookd driving arrived
		ride.d = Math.abs(ride.sx - ride.fx) + Math.abs(ride.sy - ride.fy)//distance to destination

		//origigrid[ride.sy][ride.sx].push(ride)
		ridesAvailables.push(ride)
	
	}
	//console.log('-------------origigrid---------------')
	console.log('ridesAvailables '+ ridesAvailables.length);
	
	//assign best trips to available cars

		//assign best trips to available cars
			var fleetAvailables = fleet.filter(e=>{
				return e.status == 'f'
			})
			
			calculateCost(ridesAvailables,{x:0,y:0},0)

		for(clock =0;clock<t;clock++){

			console.log("clock: " + clock + " out of " + t)
			
				//remove strandeds
				fleetAvailables = fleet.filter(e=>{
					return e.stranded != true;
				})
				ridesAvailables = ridesAvailables.filter(e=>{
					return e.status == 'f'
				})
				console.log("rides: " + ridesAvailables.length + " fleets: " + fleetAvailables.length)
				
				if(ridesAvailables.length ==0){
					console.log("rides finished exiting...")
					eureka(possibleSolutions)
				}
				
				let i=0
				fleetAvailables.forEach(fleetCar=>{
					console.log("fleet: " +i +" of " + fleetAvailables.length)
					assignDepthwise(ridesAvailables,fleetCar,clock,GREED,false)
					i++;
				})
				fleetAvailables = fleet.filter(e=>{
					return e.stranded != true;
				})
				i=0
				fleetAvailables.forEach(fleetCar=>{
					console.log("fleet: " +i +" of " + fleetAvailables.length)
					assignDepthwise(ridesAvailables,fleetCar,clock,GREED,true)
					i++;
				})

				
			if(ridesInProgress.length <1){
					console.log("no rides exit early?")
					eureka(possibleSolutions)
					
			}
			//updateLocation for each tick
				ridesInProgress.forEach(e=>{
					//console.log('ride: ' + e.id + + ' start: '+e.s + " eta: "+(e.d+e.s))
					//console.log(e)
					if(e.s <= clock){//start moving
						e.status='d'
						
						var fleetCar = fleet.find(function(element) {
										return element.id == e.fleetCarId;
									});
						fleetCar.status = 'd'	
						e.lateStart = (clock - e.s)<0
						//console.log('ride: ' + e.id + + ' started: '+clock +  ' eta: '+ e.arrivalClock  ' lateStart: '+ e.lateStart)
						//console.log(e)
					}
					if(e.dropOffTime <=clock ){//arrived
						e.status='a'
						var fleetCar = fleet.find(function(element) {
										return element.id == e.fleetCarId;
									});
						fleetCar.status = 'f'
						fleetCar.x=e.fx;
						fleetCar.y=e.fy;
						e.lateFinish = (e.dropOffTime - e.f)>=0
						console.log('arrived ride: ' + e.id +  ' lateFinish: ' + e.lateFinish +  ' eta: '+ e.arrivalClock + ' lateStart: '+ e.lateStart)
						//console.log(e)
					}
					
				})
	
		//remove arrivals from list
				//console.log('ridesInProgress b4 filter')
				//console.log(ridesInProgress.length)
				ridesInProgress = ridesInProgress.filter(e =>{ return (e.status =='d' || e.status =='b' )} );
				
				fleetAvailables = fleetAvailables.filter(e=>{
					return e.status == 'f'
				})
			
			//skip non exciting loops upto earliest destination time
			var futureHop = ridesInProgress.length>0?ridesInProgress[0].dropOffTime:clock
			ridesInProgress = ridesInProgress.sort((a,b)=>{//sort
					return b.dropOffTime - a.dropOffTime;
				})
			console.log('ridesInProgress: ' + ridesInProgress.length + " fleetAvailables: "+ fleetAvailables.length +" next futureHop: "+ futureHop)
			
			if(fleetAvailables.length <1){
				if(futureHop > clock+1){
						console.log("time hop to closest clock: " +clock +" dropOffTime: " +futureHop)
						clock = futureHop - 1
						continue
				}
			}
			

		}		
			
			
			

	eureka(possibleSolutions)
}


function copy(arr){
	var arr2 = []; // create empty array to hold copy
	// for loop to apply slice to sub-arrays
	for (var i = 0, len = arr.length; i < len; i++) {arr2[i] = arr[i].slice();}
	return arr2;
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function calculateCost(rides,car,clock){
	
	rides.forEach(a=>{
		var ta = earliestPickup(car,a,clock)
		a.pickupTime = ta
		a.dropOffTime = ta + a.d
		a.lateStart = (a.pickupTime > a.s)
		a.lateDrop = (a.dropOffTime >= a.f)
		
		//earnings  = bonus + distance
		a.earnings = 0;
		if(!a.lateStart){//picked on time
			a.earnings += bonus;
		}
		if(!a.lateDrop){//dropped on time
			a.earnings += a.d;
		}
	});

	//eta must b less than time limit
	rides = rides.filter((a)=>{
		//console.log("eta must b less than time limit "+ t)
		//console.log(a)
		return  !a.dropOffTime?true:(a.dropOffTime <= t);
	})

	return rides;
}



function findClosestToStartRides(rides,car,clock,trim){//allowed only
	//let distances  = new Map();
	
	rides = calculateCost(rides,car,clock)

	rides.sort((a,b)=>{
		return b.pickupTime- a.pickupTime;
	})

	//console.log("findClosestToStartRides " + rides.length)
	if(trim)
		return rides.splice(0,trim)
	return rides
}

function findClosestToEndRides(rides,car,clock,trim){
	
	rides = calculateCost(rides,car,clock)
	
	rides.sort((a,b)=>{
		var ta = a.dropOffTime
		var tb = a.dropOffTime
		return tb-ta;
	})
	//console.log("findClosestToEndRides " + rides.length)
	if(trim)
		return rides.splice(0,trim)
	return rides
}

function findRichestRides(rides,car,clock,trim){
	
	rides = calculateCost(rides,car,clock)
	
	rides.sort((a,b)=>{
		
		//earnings  = bonus + distance
		var amoney=a.earnings;
		var bmoney =b.earnings;
		return bmoney-amoney;
	})
	//console.log("findRichestRides " + rides.length)
	if(trim)
		return rides.splice(0,trim)
	return rides
}
function findShortestRidesLateStartlast(rides,car,clock,trim){//shortest to longest
	
	rides = findClosestToEndRides(rides,car,clock,trim)
	
				var notlate = rides.filter(e=>{
								return !e.lateStart;
				})
				var late = rides.filter(e=>{
								return e.lateStart;
				})
				
	return notlate.concat(late)
}
function findShortestRidesLateDroplast(rides,car,clock,trim){//shortest to longest
	
	rides = findClosestToEndRides(rides,car,clock,trim)
	
				var notlate = rides.filter(e=>{
								return !e.lateDrop;
				})
				var late = rides.filter(e=>{
								return e.lateDrop;
				})
				
	return notlate.concat(late)
}

function earliestPickup(car,ride,clock){
//console.log("earliestPickup  clock " + clock)
	var start = ride.s - clock //clock<ride.s?ride.s:clock
	//console.log("earliestPickup start: " + start)
	start=start<0?0:start
	//var fin =  ride.f - clock; 
	var distFrom = Math.abs(ride.sx - car.x) + Math.abs(ride.sy - car.y)
	//console.log("earliestPickup distFrom: " + distFrom)
	//var distTo = ride.d
	var time = Math.max(start,distFrom) //longer of the 2 as we r heading there
	//console.log("earliestPickup: " + (t + clock))
	return time + clock
}

function assignDepthwise(ridesAvailables,fleetCar,originClock,greed,includeUnused){ //greed =% 0-100
	
	//choose rides on distance
	//console.log("assignDepthwise")
	//console.log("fleetCar")
	//console.log(fleetCar)

	//console.log('rides')
				//console.log(rides)
				var clonedFleetCar = Object.assign({}, fleetCar);
				
				var clock = originClock;
				
				var smalllist = ridesAvailables.filter(e=>{
						return e.status == 'f'
					});
				//if no one around a driver anymore he will never ride again.mark stranded
					if(smalllist.length <1){
						console.log("stranded: " + fleetCar.x + ":"+ fleetCar.y  )
						var clonedFleetCar = fleet.find(function(element) {
										return element.id == clonedFleetCar.id;
									});
						clonedFleetCar.stranded = true;
						//strand all cars at this position
						fleet.forEach(element => {
								if(element.x == clonedFleetCar.x && element.y == clonedFleetCar.y){
									console.log("stranded id: " + element.id  )
									element.stranded = true;
								}		
						});
						
						return;
					}
				

					
				do{
					//console.log('ridesAvailables:' + ridesAvailables.length + "filterd: " + smalllist.length)	
				smalllist =  findShortestRidesLateStartlast(smalllist,clonedFleetCar,clock)//findRichestRides(findClosestToStartRides(smalllist,clonedFleetCar,clock),clonedFleetCar,clock)findClosestToEndRides findShortestRidesLateStartlast  findShortestRidesLateDroplast findShortestRidesLateDroplast
						console.log("realclock:simclock " + `${originClock}:${clock}`  + " b4filter availablerides: " + smalllist.length + " for fleet car: "+ `clonedFleetCar ${clonedFleetCar.id} ${clonedFleetCar.x}:${clonedFleetCar.y}`)

						var earlyStart = smalllist.filter(e=>{
								return !e.lateStart;
							})
							var lateStart = smalllist.filter(e=>{
								return e.lateStart;
							})
							var earlyDrop = lateStart.filter(e=>{
								return !e.lateDrop;
							})
							var lateDrop = lateStart.filter(e=>{
								return e.lateDrop;
							})
							var lates = earlyDrop.concat(lateDrop);
							
							var eaten = (lates.length * (greed/100)) 
							
							smalllist = earlyStart.concat(lates.slice(0,eaten));
							
							var unused = lates.slice(eaten)

							
							console.log("smalllist "+ smalllist.length+ " unused "+ unused.length)
					console.log("realclock:simclock " + `${originClock}:${clock}`  + " availablerides: " + smalllist.length + " for fleet car: "+ `clonedFleetCar ${clonedFleetCar.id} ${clonedFleetCar.x}:${clonedFleetCar.y}`)
					
					if(includeUnused){
						
								smalllist = earlyStart.concat(unused)
								console.log("consume all "+smalllist.length)
					}
					var ride = smalllist.shift()
					if(ride){
						//hack save final picked snapshot since they r object refs
						ride.pickupTimeFinal = ride.pickupTime
						ride.dropOffTimeFinal = ride.dropOffTime
						ride.lateStartFinal = ride.lateStart
						ride.lateDropFinal = ride.lateDrop
						ride.earningsFinal = ride.earnings
						
						
						
						
						possibleSolutions.has(clonedFleetCar.id)?possibleSolutions.get(clonedFleetCar.id).push(ride):possibleSolutions.set(clonedFleetCar.id,[ride])
						ride.status ='b'
						ride.fleetCarId= clonedFleetCar.id
						var clonedFleetCar = fleet.find(function(element) {
										return element.id == clonedFleetCar.id;
									});
						clonedFleetCar.status='b'
						ridesInProgress.push(ride)
						console.log("booking ride: " + ride.id)
						
						//var clonedFleetCar = Object.assign({}, clonedFleetCar);
						clonedFleetCar.x = ride.fx
						clonedFleetCar.y = ride.fy
						clock = ride.dropOffTime
						//assignDepthwise(ridesAvailables,clonedFleetCar,clock)
						 //console.log("rides: " + ridesAvailables.length)
					}else{
						//no ride for this clonedFleetCar?
						console.log('no ride for this fleetCar')
					
					} 
				}while(smalllist.length>0)
					
					
					
				
}



function eureka(sol){
	console.log('-------------eureka---------------')

	
	var answer = '';
	var earnings = 0;
	var line  =""
	var totalRides =0
	var lateDrop = 0
	var lateStart = 0
	console.log('sol');
	
	var usedFleet = sol.size;
	
	[...sol.keys()].forEach(s => {
		answer += '' + sol.get(s).length + ' '
		totalRides +=sol.get(s).length
		//console.log(sol.get(s));
		var earn = 0
		
		sol.get(s).forEach(e=>{
			//console.log('each ride');
			//console.log(e);
			answer += `${e.id} `
			earnings += e.earningsFinal
			
			line  += ":"+e.earningsFinal
			earn += e.earningsFinal
			
			if(e.lateStartFinal)lateStart +=1
			if(e.lateDropFinal)lateDrop +=1
			
		})
		answer += "\n"
		line += " = " +earn + "\n"
	});
	//fill in blank car trips
	for(x=usedFleet;x<f;x++){
		answer += "0\n"
	}
	
	console.log('answer');
	console.log(answer);
	
	console.log('earnings');
	console.log(earnings);
	
		
	console.log('------------per fleet earnings');
	console.log(line);

	console.log('bonus: '+ bonus +' earnings: '+ earnings + " trips:alltrips " + `${totalRides} : ${n}` + " fleet:allfleet " +  `${usedFleet} : ${f}` + " lateDrop:lateStart " +`${lateDrop}:${lateStart}`);
	
	console.timeEnd("script")
	var fs = require('fs');
	fs.writeFileSync("1.out", answer);
	process.exit()
}



 /*
to run:
 node solution.js < small.in

 //$ echo test | node stdin.js
<Buffer 74 65 73 74 0a>
EOF
$ echo -n | node stdin.js
EOF
$ node stdin.js < /dev/null
*/
process.stdin.resume();
process.stdin.setEncoding('ascii');

console.time("script");

var input_stdin = "";
var input_stdin_array = "";
var input_currentline = 0;

let pics =[];


//output()

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

class Pic{
 constructor(pos,orientation,tags){
     this.pos = pos;
     this.orientation=orientation
     this.tags = tags
 }

}
function main() {

	let a = parseInt(readLine());
  //  console.log(a);
    
    let pics =[];
    let picsTotal =[];

    for(var x=0;x<a;x++){
    let b = readLine();
    let c = b.split(" ");
    let orientation = c[0];
    //let tagCount = parseInt(c[1]);
    let tags = c.splice(2);

    let pic = new Pic(x,orientation,tags)
    pics.push(pic);
    }
	


  // console.log(pics);


   //sort by tag size
 //  pics.sort(function(a, b) {
 //   return a.tags.length - b.length;
 // });


  var picsH = pics.filter(function(a) {
    return a.orientation == "H";})
    picsH = Object.assign({}, picsH);
    var picsV = pics.filter(function(a) {
        return a.orientation == "V";})
    // picsV = Object.assign({}, picsV);
    // picsV = [...picsV];
    //picsV = pics;


 console.log(picsH.length);
 console.log(picsV.length);

 let total = picsV.length

 picsTotal.push([picsV[0]]); removeEl(picsV,picsV[0])
 let first = false;
 for(var x = picsV.length -1; x >= 0 ; x--){//for(let x=1;x<pics.length;x++){
    if(picsTotal[picsTotal.length -1].length==1 && picsTotal[picsTotal.length -1][0].orientation=="V"){
        first = true;
     }
  console.log(`item ${x} of ${total}`)
    pickNext(picsTotal,picsV)

     //remove last one if its v and alone
 if(first && picsTotal[picsTotal.length -1].length==1 && picsTotal[picsTotal.length -1][0].orientation=="V"){
    picsTotal.pop();
 }
 first = false;
 }




//   picsTotal.push([picsH[0]]);
//  for(let x=1;x<picsH.length;x++){
//     if(canPAir(picsTotal[picsTotal.length -1][0],picsH[x])){
//         picsTotal[picsTotal.length -1].push(picsH[x]);
//        // console.log("paired" + picsTotal.length)
//       // removeEl(picsH,picsH[x])
//     }else{
//         if(picsTotal[picsTotal.length -1].length==2 || picsTotal[picsTotal.length -1][0].orientation =="H" ){
//             picsTotal.push([picsH[x]]);
//            // removeEl(picsH,picsH[x])
//         }
//     }
//  }


//  picsTotal.push([picsV[0]]);
//  for(let x=1;x<picsV.length;x++){
//     if(canPAir(picsTotal[picsTotal.length -1][0],picsV[x])){
//         picsTotal[picsTotal.length -1].push(picsV[x]);
//        // console.log("paired" + picsTotal.length)
//     }else{
//         if(picsTotal[picsTotal.length -1].length==2 || picsTotal[picsTotal.length -1][0].orientation =="H" ){
//             picsTotal.push([picsV[x]]);
//         }
//     }
//  }

//  picsTotal.push([picsV[0]]);

//  for(var x = picsV.length -1; x >= 0 ; x--){//for(let x=1;x<pics.length;x++){
//     if(canPAir(picsTotal[picsTotal.length -1][0],picsV[x])){
//         picsTotal[picsTotal.length -1].push(picsV[x]);
//        // console.log("paired" + picsTotal.length)
//        removeEl(picsV,picsV[x])

//     }else{
        
//     }
//  }


output(picsTotal);

}

function pickNext(picsTotal,picsFrom){

    let scores =0;
    let scoresV =0;
    let pic = null;
    
    for(var x = picsFrom.length -1; x >= 0 ; x--){//for(let x=1;x<pics.length;x++){

        let latestTags = picsTotal[picsTotal.length -1][0].tags;
        if(picsTotal[picsTotal.length -1].length==2){//merge
            latestTags = latestTags.concat(picsTotal[picsTotal.length -1][1].tags.filter(function (item) {
                return latestTags.indexOf(item) < 0;
            }));
        }

        let newScore = score(latestTags,picsFrom[x].tags)

        if(picsTotal[picsTotal.length -1].length==1 && picsTotal[picsTotal.length -1][0].orientation=="V" &&  picsFrom[x].orientation=="V"){//picking 2nd V vs transition

            if(scoresV < newScore){
                scoresV = newScore;
                scores = scoresV
                pic = picsFrom[x]
              //  console.log(pic)
                console.log("s2ndV " + scores)
                if(scores==0){
                    break;
                }
            }

        }else{
        if(scores < newScore){
            scores = newScore;
            pic = picsFrom[x]
          //  console.log(pic)
            console.log("stransition " + scores)
        }

        }

       

    }

    if(pic !=null){
        if(picsTotal[picsTotal.length -1].length==1 && picsTotal[picsTotal.length -1][0].orientation=="V" &&  pic.orientation=="V"){
            //add here - for 2nd v
            picsTotal[picsTotal.length -1].push(pic);
            removeEl(picsFrom,pic)
           // break;
           console.log("score 2nd V " + scores)
        }else if(picsTotal[picsTotal.length -1].length==2 || (picsTotal[picsTotal.length -1].length==1 && picsTotal[picsTotal.length -1][0].orientation=="H")){
            //add here for new H or new v
            picsTotal.push([pic]);
            removeEl(picsFrom,pic)
            console.log("score transition " + scores)
          //  break;
        }else{
            //not picked

        }
    }

 }

function removeEl(arr,ele){
    for(var i = arr.length -1; i >= 0 ; i--){
        if(arr[i].pos == ele.pos){
            arr.splice(i, 1);
        }
    }
   // console.log(arr.length)
}
function canPAir(arr1,arr2){
   return "V" == arr1.orientation && arr1.orientation == arr2.orientation
}

function score(arr1,arr2){

    var intersections = arr1.filter(e => arr2.indexOf(e) !== -1).length;
    var uniq1 = arr1.length - intersections;
    var uniq2 = arr2.length - intersections;

    return Math.min(intersections, uniq1, uniq2);

}

function output(totals){
    console.log('-------------output---------------')
    
    var answer = ""+totals.length
    console.log(totals)
  // totals =  totals.splice(-1,1)
    
for(let x=0;x<totals.length;x++){
   if(totals[x].length == 1){
    answer +="\n" + totals[x][0].pos
   }else{
    answer += "\n" +  totals[x][0].pos + " " + totals[x][1].pos ;
   }

}

	console.log(answer);
	var fs = require('fs');
	fs.writeFileSync("5b.out", answer);
	process.exit()
}


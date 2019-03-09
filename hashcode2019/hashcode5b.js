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
let totalScore = 0

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
   pics.sort(function(a, b) {
    return a.tags.length - b.length;
  });


  var picsH = pics.filter(function(a) {
    return a.orientation == "H";})
   
    var picsV = pics.filter(function(a) {
        return a.orientation == "V";})
    // picsV = Object.assign({}, picsV);
    //picsV = pics;



console.log(pics.length);
 console.log(picsH.length);
 console.log(picsV.length);


 //group V
 let pairs = []
 for(var x = picsV.length -1; x >= 0 ; x--){
  //  picsV = picsV.filter(x => x !=picsV[x]);
  console.log(`pair item ${x} of ${picsV.length}`)
  let current = picsV[x];
  removeEl(picsV,current);
   var pic = pair(current,picsV)

   if(pic !=null){
       x--;
    pairs.push([current,pic]); removeEl(picsV,pic)
   }
   
 }

let slides = [];

picsH.forEach(element => {
    slides.push([element])
});

slides= slides.concat(pairs);

   //sort by tag size
   slides.sort(function(a, b) {
    let aTags = a[0].tags;
    if(a.length==2){//merge
        aTags = aTags.concat(a[1].tags.filter(function (item) {
            return aTags.indexOf(item) < 0;
        }));
    }
    let bTags = b[0].tags;
    if(b.length==2){//merge
        bTags = bTags.concat(b[1].tags.filter(function (item) {
            return bTags.indexOf(item) < 0;
        }));
    }

    return aTags.length - bTags.length;
  });


 for(var x = slides.length -1; x >= 0 ; x--){//for(let x=1;x<pics.length;x++){

    if(picsTotal.length==0){
        picsTotal.push(slides[0]); removeEl(slides,slides[0])
     }

  console.log(`item ${x} of ${slides.length}`)
  var pic,scores;
  ({pic,scores} = group(picsTotal[picsTotal.length-1],slides))
  if(pic!=null){

  //  let a=  [].concat(...picsTotal[picsTotal.length-1]); //picsTotal[picsTotal.length-1].flat();
   // let b=  [].concat(...next)//next.flat(2);
 //   let tag1 = a.map(x => x.tags);
 //   let tag2 = b.map(x => x.tags);

    totalScore += scores//score(tag1,tag2)
    picsTotal.push(pic); removeEl(slides,pic)
  }else{
      console.log("no next?  drop current..." )
     // picsTotal.pop();//slides.push(picsTotal.pop())

  }
  
   
 }

output(picsTotal);

}

function pair(pic1,picsFrom){

    let scores =0;
    let pic = null;
    let latestTags = pic1.tags;
    for(var x = picsFrom.length -1; x >= 0 ; x--){//for(let x=1;x<pics.length;x++){
        
        newScore = difference(latestTags,picsFrom[x].tags)

            if(scores < newScore){
                scores = newScore;
                pic = picsFrom[x]
                pic.score =scores;
              //  console.log(pic1.pos + " pair dif" + scores)     

                //if tags r shorter than current score no need to check the rest
                
            }
            if(scores>=picsFrom[x].tags.length){//optimisation
                console.log("biggest found   breaking..." + scores)   
                break;
            }
    }
    if(pic ==null){
        //no match pick random
        console.log("no match. picking random")
        scores = 0
      //  let f = picsFrom.filter(x => x !=pic1);
       // pic = f[0]
        pic = picsFrom[0]
        pic.score =scores
    }
    console.log(pic.pos + " pair " + scores) 
    return pic;
 }
 function group(arr1,picsFrom){

    let scores =0;
    let pic = null;
    let latestTags = arr1[0].tags;
        if(arr1.length==2){//merge
            latestTags = latestTags.concat(arr1[1].tags.filter(function (item) {
                return latestTags.indexOf(item) < 0;
            }));
        }

    for(var x = picsFrom.length -1; x >= 0 ; x--){//for(let x=1;x<pics.length;x++){
        
        let fromTags = picsFrom[x][0].tags;
        if(picsFrom[x].length==2){//merge
            fromTags = fromTags.concat(picsFrom[x][1].tags.filter(function (item) {
                return fromTags.indexOf(item) < 0;
            }));
        }

        newScore = score(latestTags,fromTags)

            if(scores < newScore){
                scores= newScore;
                pic = picsFrom[x]
             //   console.log("group " + scores)
            }
            if(scores>=fromTags.length){//optimisation
                console.log("biggest found   breaking..." + scores)   
                break;
            }
    }
    if(pic ==null){
        //no match pick random
        console.log("no match. picking random")
        scores = 0
        pic = picsFrom[0]
    }
    if(pic !=null)
    console.log(pic[0].pos + " group " + scores) 
    return {pic:pic,scores:scores};
 }


function removeEl(arr,ele){
    for(var i = arr.length -1; i >= 0 ; i--){
        if(arr[i] == ele){
            arr.splice(i, 1);
        }
    }
   // console.log(arr.length)
}

function score(arr1,arr2){

    var intersections = arr1.filter(e => arr2.indexOf(e) > -1).length;
    var uniq1 = arr1.length - intersections;
    var uniq2 = arr2.length - intersections;

    return Math.min(intersections, uniq1, uniq2);

}
function difference(arr1,arr2){

    var intersections = arr1.filter(e => arr2.indexOf(e) !== -1).length;
    //var uniq1 = arr1.length - intersections;
    var uniq2 = arr2.length - intersections;

    return uniq2;

}

function output(totals){
    console.log('-------------output---------------')
    
    var answer = ""+totals.length
    var answerScore = ""+totals.length
    //console.log(totals)
  // totals =  totals.splice(-1,1)
    
for(let x=0;x<totals.length;x++){
   if(totals[x].length == 1){
    answer +="\n" + totals[x][0].pos
    answerScore +="\n" + totals[x][0].pos 
   }else{
    answer += "\n" +  totals[x][0].pos + " " + totals[x][1].pos ;
    answerScore += "\n" +  totals[x][0].pos +" " + totals[x][1].pos  ;
   }

}

    console.log(answerScore);
    console.log(`total slides ${totals.length} totalScore ${totalScore}`)
	var fs = require('fs');
	fs.writeFileSync("4b.out", answer);
	process.exit()
}


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

let max = 0;
let items =[];

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

class Piz{
 constructor(pos,val,weight){
     this.pos = pos;
     this.v=val
     this.w = weight
 }

} 
function main() {


    let a = readLine();//parseInt(readLine());
    let a1 = a.split(" ");//a0 is limit a[1] is slices
    max = parseInt(a1[0]);
    let b = readLine();
    let values = b.split(" ");//pizzas array length ==a[1]
    let weights = [...values];

    for(var x=0;x<values.length;x++){
      let piz = new Piz(x,parseInt(values[x]),parseInt(values[x]))
      items.push(piz);
    }
 

    console.log(maxKnapsack(items, max));

   // var totals = knapsack(items, max);
   // output(totals);
}

function maxKnapsack(items, W) {
  let cache = [];
  console.log("creating table ...");
  for (g = 0; g < items.length+1; g++){
       cache[g] = [];
       for (h = 0; h < W+1; h++) {
            cache[g][h] = 0;
       }
  }
  let weights = items.map(item => item.w);
  let values = items.map(item => item.v);
  for (let i = 0; i < items.length+1; i++) {
       for (let j = 0; j < W+1; j++) {
            if (i === 0 || j === 0){
                 cache[i][j] = 0;
                } else if (weights[i-1] <= j) {
                 let included = values[i-1] + cache[i-1][j-weights[i-1]];
                 let excluded = cache[i-1][j];
                 cache[i][j] = Math.max(included, excluded);
            }
            else{
                 cache[i][j] = cache[i-1][j]
            }
       }
  }
  return cache[items.length][W];
}
  

  function output(totals){
    console.log('-------------output---------------');
    console.log(totals);
    var myArgs = process.argv.slice(1);
   
    
    var answer = totals.subset.length + "\n";
    var line = totals.subset.map(x => x.pos).join(" ");
    answer += line;
    console.log('-------------output---------------');
    console.log(answer);
    var fs = require('fs');
    fs.writeFileSync(myArgs[0] +"_" + myArgs[1]+".out", answer);

    console.timeEnd("script");
    process.exit()
}

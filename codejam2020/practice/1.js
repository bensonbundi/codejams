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

  console.time("script");

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
 
    var totals = knapsack(items, max);
    output(totals);
}
function knapsack(items, capacity){
    // This implementation uses dynamic programming.
    // Variable 'memo' is a grid(2-dimentional array) to store optimal solution for sub-problems,
    // which will be later used as the code execution goes on.
    // This is called memoization in programming.
    // The cell will store best solution objects for different capacities and selectable items.
    var memo = [];
    console.log("prepare array");
    // Filling the sub-problem solutions grid.
    for (var i = 0; i < items.length; i++) {
      // Variable 'cap' is the capacity for sub-problems
      var row = [];
      for (var cap = 1; cap <= capacity; cap++) {
        
        row.push(getSolution(i,cap));

      }
      console.log(row)
      memo.push(row);
    }
 
    // The right-bottom-corner cell of the grid contains the final solution for the whole problem.
    return(getLast());
  
    function getLast(){
      var lastRow = memo[memo.length - 1];
      return lastRow[lastRow.length - 1];
    }
  
    function getSolution(row,cap){

      const NO_SOLUTION = {maxValue:0, subset:[]};
      // the column number starts from zero.
      var col = cap - 1;
      var lastItem = items[row];
      // The remaining capacity for the sub-problem to solve.
      var remaining = cap - lastItem.w;
  
      // Refer to the last solution for this capacity,
      // which is in the cell of the previous row with the same column
      var lastSolution = row > 0 ? memo[row - 1][col] || NO_SOLUTION : NO_SOLUTION;
      // Refer to the last solution for the remaining capacity,
      // which is in the cell of the previous row with the corresponding column
      var lastSubSolution = row > 0 ? memo[row - 1][remaining - 1] || NO_SOLUTION : NO_SOLUTION;
  
      console.log(`row:${row} col:${col} of ${items.length} max needed: ${max} current: ${cap}`);
      // If any one of the items weights greater than the 'cap', return the last solution
      if(remaining < 0){
        console.log(`cap reached ${row} ${col}:`);
        return lastSolution;
      }
      // //if alredy at max - exit early
      // // If we have found target already exit
      // if(lastSolution.maxValue==max){
      //   console.log(`best score reached row ${row} early exit`);
      //   console.log(lastSolution)
      //   process.exit();
      //   return lastSolution;
      // }
      if(lastSolution.maxValue>max){
        console.log(`max surparsed at row ${row}`);
        console.log(lastSolution)
        process.exit();
        return lastSolution;
      }
  
      // Compare the current best solution for the sub-problem with a specific capacity
      // to a new solution trial with the lastItem(new item) added
      var lastValue = lastSolution.maxValue;
      var lastSubValue = lastSubSolution.maxValue;
  
      var newValue = lastSubValue + lastItem.v;
      if(newValue >= lastValue){
        // copy the subset of the last sub-problem solution
        var _lastSubSet = lastSubSolution.subset.slice();
        _lastSubSet.push(lastItem);
        return {maxValue: newValue, subset:_lastSubSet};
      }else{
        return lastSolution;
      }
    }
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

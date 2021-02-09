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

let pics = [];
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

function main() {

    let a = parseInt(readLine());
    //  console.log(a);

    for (var k = 0; k < a; k++) {
        let b = readLine();
        let c =[]
        for (var y = 0; y < b; y++) {
            let d = readLine();
            c.push(d.split(" "))
        }

        
        let sum =[];
        let z=0;
        for (var x = 0; x < b; x++) {
            z=x;
            let total=0;
            for (var y = 0; y< b; y++) {
                total +=parseInt(c[y][z]);
            }
            sum.push(total);
          //  console.log(total)
          //  console.log(sum)
        }
        let max =Math.max(...sum);
        console.log(`Case #${k+1}: ${max}`)
        
        
    }
  
}
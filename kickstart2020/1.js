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

    for (var x = 0; x < a; x++) {
        let b = readLine();
        let c = [], d = [];
        let count = -1, pos1 = 0, pos2 = 0;
        do {
            pos1 = b.indexOf('KICK', pos1) + 1;
            if (pos1 != -1) {
                c.push(pos1);
            }
        } while (pos1 > 0);
        do {

            pos2 = b.indexOf('START', pos2) + 1;
            if (pos2 != -1) {
                d.push(pos2);
            }

        } while (pos2 > 0);

        c.forEach(p => {
            d.forEach(p2 => {
                if (p2 > p) {
                    count++;
                }
            })

        })
        count=count-1;
        if(count<0)count=0;
        console.log(`Case #${x}: ${count}`);
    }
  
}
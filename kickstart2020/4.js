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
        
        var c = parseInt(b.split(" ")[0])
        var d = parseInt(b.split(" ")[1])
        let e = readLine().split(" ");
        let f = new Set();
        e.forEach(a=>{
            f.add(parseInt(a))
        })
        f.add(d)
        let g =[];
       let h = Array.from(f);

       console.log(h)
       let z=[]
            for (var y = 0; y < h.length; y++) {
                let val=(h[y])
                let  total =0;
                
               
                for (var x = y+1; x < h.length; x++) {
                  let  t =Math.abs(val-(h[x]))
                  let t1 = val+(d-h[x])
                  t =Math.min(t,t1)
                    //total +=t;
                    if(x<h.length-1){
                        z[val]= (+z[val]||0)+t
                    }
                   
                    z[h[x]]= (+z[h[x]]||0)+t
                    console.log(`${val}-${h[x]}=${t} tot ${z[val]}`)
                }
               // if(total>0)
               // g.push(total)
               // console.log(total)
            }
            console.log(z)
          let min = Math.min(...z.filter(String))
        
        console.log(`Case #${k+1}: ${min}`)
        
        
    }
  
}
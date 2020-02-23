/*
to run:
node solution.js < small.in
node --inspect --inspect-brk 1.js <a_example.txt a_example
PS E:\codejams\codejam2020\books> Get-Content a_example.txt | node --inspect --inspect-brk 1.js  a_example
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

let days = 0;
let daysLeft = 0;
let books = [];
let booksLeft = [];
let libs = [];
let libsLeft = [];
let libOrder = [];
let bookOrder = [];
let currentLib;

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


class Book {
  constructor(pos, score) {
    this.pos = pos;
    this.score = score
    this.reg = false;
    this.w = 1
    this.v = score
  }
}
class Lib {
  constructor(pos,  books,signup, rate, actualbooks) {
    this.pos = pos;
    this.books = books
    this.signup = signup
    this.signupLeft = signup
    this.rate = rate
    
    this.actualbooks = actualbooks
    this.booksScanned = []
    this.started = false;
    this.mineable = false;
    this.w = 1
    this.v = 1

    this.cache = [];
  }
  getRemainingBooks() {
    //track books registered
    var l = this;
   // console.log("l.books: " + l.books);
   // console.log(l.actualbooks);
    var remainingBooks = booksLeft.filter(b => {

      return !b.reg && l.actualbooks.includes(b.pos)
    }).sort(function (a, b) {//descending
      if (a.v > b.v) {
        return -1;
      }else{
        return 1;
      }
    });
  //  console.log("remainingBooks: " + remainingBooks.length);

    return remainingBooks.slice(0, l.rate);
  }
  getBooksScoreLeft() {
    //track books registered
    var remainingBooksScore = this.getRemainingBooks().map(b=>b.v).reduce((total, v) => {
      return total+v;
    });
    console.log("score " + remainingBooksScore);
    return remainingBooksScore;
  }
  getYield() {
    var yields = this.cache[(daysLeft - this.signupLeft)];
    if(yields !=null) return yields;
    if (daysLeft - this.signupLeft<0) {
      yields = 0;
    } else {
      yields = this.getBooksScoreLeft() * this.rate * 1.0 * (daysLeft - this.signupLeft);
    }
    console.log(`lib:${this.pos}/${libs.length} yields: ${yields}`);
    this.cache[(daysLeft - this.signupLeft)]= yields;
    return yields;
  }
  start() {
    this.started = true;
    this.mineable = true;
  }
  mine() {
    if (this.started && this.mineable) {
      var l = this.getRemainingBooks();
      for (var x = 0; x < l.length; x++) {
        booksLeft[l[x].pos].reg = true;
        bookOrder.push(booksLeft[l[x].pos]);
        console.log("mining book " + l[x].pos)
        this.booksScanned.push(booksLeft[l[x].pos])

      }
      if (this.getRemainingBooks().length == 0) {
        this.mineable = false;
        var me = this
        //remove from list
        libsLeft = libsLeft.filter(function (value, index, arr) {
          return value.pos != me.pos;
        });


      }
    }


  }
}
function main() {

  console.time("script");

  let a = readLine().split(" ");
  let bookCount = parseInt(a[0]);
  let libCount = parseInt(a[1]);
  days = parseInt(a[2]);
  daysLeft = days;
  let b = readLine().split(" ");

  console.log("bookCount,libCount,days");
  console.log(bookCount, libCount, days);

  for (var x = 0; x < bookCount; x++) {
    let book = new Book(x, parseInt(b[x]));
    books.push(book);
  }
  for (var x = 0; x < libCount; x++) {
    let c = readLine().split(" ");
    let d = readLine().split(" ");
   // console.log(d)
    let lib = new Lib(x, parseInt(c[0]), parseInt(c[1]), parseInt(c[2]), d.map(b => parseInt(b)));
    libs.push(lib);
  }
  booksLeft = books.slice();
  libsLeft = libs.slice();


  //console.log(booksLeft,libsLeft);

  knapsack();
  // output(totals);
}

function knapsack() {

  for (var x = 0; x < days; x++) {
    console.log(`day ${x}/${days}`);
    daysLeft = days - x;

    register()

    libOrder.forEach(lib => {
      lib.mine();
    });

  }
  //output
  output();
}

function register() {

  if (currentLib == null && libsLeft.length > 0) {

    libsLeft = libsLeft.sort(function (a, b) {//descending
      if (a.getYield() > b.getYield()) {
        return -1;
      }else{
        return 1;
      }
    });
    console.log("libsLeft " + libsLeft.length);

    currentLib = libsLeft[0];
    libOrder.push(currentLib)
    libsLeft = libsLeft.filter(function (value, index, arr) {
      return value.pos != currentLib.pos;
    });
  } else if (currentLib == null && libsLeft.length == 0) {//no more libs
    //console.log("no more libsLeft " + libsLeft.length);
    return
  } else {
    currentLib.signupLeft -= 1;
    //console.log(`libCurrent.signupLeft ${currentLib.pos} ${currentLib.signupLeft}/${currentLib.signup}`);

    if (currentLib.signupLeft <= 0) {
      currentLib.start();//can start mining kesho
      //find new lib
      currentLib = libsLeft[0];
      if(currentLib !=null){
      //start count down
      libOrder.push(currentLib)
      libsLeft = libsLeft.filter(function (value, index, arr) {
        return value.pos != currentLib.pos;
      });
      
     // console.log(`new lib ${currentLib.pos} ${currentLib.signupLeft}`);
    }
    }

  }
}


function output() {
  console.log('-------------output---------------');
  console.log(libOrder.map(l => l.pos));
  console.log(bookOrder.map(l => l.pos));
  var myArgs = process.argv.slice(1);
  console.log('-------------output---------------');

  let finalLib = libOrder.filter(l=>{
    if(!l.booksScanned.length>0){
      console.log(`filtered unscanned lib ${l.pos}`)
      return false
    }
    return true;
  })
  var answer = finalLib.length + "\n";
  finalLib.forEach(lib => {
    answer += lib.pos + " " + lib.booksScanned.length + "\n";
    answer += lib.booksScanned.map(b=>{return b.pos}).join(" ") + "\n";
  });

  console.log(answer);
  var fs = require('fs');
  fs.writeFileSync(myArgs[0] + "_" + myArgs[1] + ".out", answer);

  console.timeEnd("script");
  process.exit()
}

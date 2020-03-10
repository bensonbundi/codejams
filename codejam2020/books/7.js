/*
to run:
node solution.js < small.in
node --inspect --inspect-brk 1.js <a_example.txt a_example
PS E:\codejams\codejam2020\books> Get-Content a_example.txt | node --inspect --inspect-brk 7.js  a_example
//$ echo test | node stdin.js
<Buffer 74 65 73 74 0a>
EOF
$ echo -n | node stdin.js
EOF
$ node stdin.js < /dev/null

Add book occurrence count - common books less priority sort by rare 1st
*/
process.stdin.resume();
process.stdin.setEncoding('ascii');

console.time("script");

console.log("to use: pass in a order param: bigFirst or fastFirst\n  Get-Content a_example.txt | node --inspect --inspect-brk 7.js  a_example bigFirst")

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

let order ='bigFirst';//fastFirst

d3 =require("d3-queue");
var q = d3.queue();
var numCPUs = require('os').cpus().length;

var threads = numCPUs * 5;
console.log(`numCPUs ${numCPUs} threads ${threads}`);
//split work to threads
//var work = Math.floor(loops/threads);
// for(x=0;x<threads-1 ;x++){
//     console.log("splitting work");
//     q.defer(generateWords,work*x,work*(x+1));
// }


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
    this.libs=[];
    this.cache = [];
   
  }
   getRemainingLibs() {
     let me = this;
    var libs = libsLeft.filter(e=>{//filter my libs
      return me.libs.includes(e.pos);
    }).filter(e=>{//filter non reg libs
      return !e.reg;
    }).sort(sortLib);
     return libs;
  }
}
class Lib {
  constructor(pos,  bookCount,signup, rate, actualbooks) {
    this.pos = pos;
    this.bookCount = bookCount
    this.signup = signup
    this.signupLeft = signup
    this.rate = rate
    this.reg = false;
    
    this.actualbooks = actualbooks
    actualbooks.forEach(element => {
        books[element].libs.push(pos)
    });

    this.booksScanned = []
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
      }).sort(sortBook);
  //  console.log("remainingBooks: " + remainingBooks.length);
//mine all allowed within pending days
var books = (daysLeft-l.signup)*l.rate;
books = books <=remainingBooks.length?books:remainingBooks.length;
    var rbooks =remainingBooks.slice(0,books);
    console.log(`lib: ${l.pos} remainingBooks ${remainingBooks.length} rbooks ${rbooks.length}`);
    return rbooks;
  }
  getBooksScoreLeft(remainingBooks) {
    //track books registered
    var remainingBooksScore = remainingBooks.reduce((total, b) => {
      return total+b.v;//rare books worth more?
    },0);
    console.log("score " + remainingBooksScore);
    return remainingBooksScore;
  }
  getYield() {

    var yields = this.cache[booksLeft.length];
    if(yields !=null) return yields;
    if (daysLeft - this.signupLeft<0) {
      yields = 0;
    } else {
     // yields = this.getBooksScoreLeft();
     yields = this.getBooksScoreLeft(this.getRemainingBooks())/this.signup;
    // yields =1/this.signup;
     
    }
    console.log(`lib:${this.pos}/${libs.length} yields: ${yields}`);
    this.cache[booksLeft.length]= yields;
    this.yields=yields;
    return yields;
  }

  mine(start) {
    if (start) {
      this.reg = true;
      daysLeft = daysLeft - this.signup;
      libOrder.push(this) //push this lib
      var l = this.getRemainingBooks();
      for (var x = 0; x < l.length; x++) {
        booksLeft[l[x].pos].reg = true;
        bookOrder.push(booksLeft[l[x].pos]);
        console.log("day mining range: "+ daysLeft +"  book " + l[x].pos + " score:"+l[x].v + " weight:"+l[x].w)
        this.booksScanned.push(booksLeft[l[x].pos])

      }  
    }
  }
}
function main() {

  console.time("script");
  var myArgs = process.argv.slice(1);
  order = myArgs[2] || 'bigFirst';

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
function getNextLib() {
  var libs = libsLeft.filter(e=>{//filter non reg libs
    return !e.reg;
  }).sort(sortLib);
   return libs[0];
}
function sortBook(a,b) {
//sort descending
   
     //add another weighing scale
     if(order=='bigFirst'){
        if (a.v < b.v) {
            return 1;
          }else if (a.v > b.v) {
            return -1;
          }
    
    }else if(order=='fastFirst'){
        var l = a.getRemainingLibs();
        var l2 = b.getRemainingLibs();
        if(l.length>0 && l2.length>0)
        if (l[0].signup < l2[0].signup) {
            return 1;
          }else if (l[0].signup > l2[0].signup) {
            return -1;
          }

          //popularity?
        if(a.libs.length<b.libs.length){
            return 1;
        }else if(a.libs.length>b.libs.length){
        return -1;
        }
    }else if(order=='weightFirst'){
        var l = a.getRemainingLibs();
        var l2 = b.getRemainingLibs();
        if(l.length>0 && l2.length>0)
        if (l[0].getYield()/a.v < l2[0].getYield()/b.v) {
            return 1;
          }else if (l[0].getYield()/a.v > l2[0].getYield()/b.v) {
            return -1;
          }

          //popularity?
        if(a.libs.length<b.libs.length){
            return 1;
        }else if(a.libs.length>b.libs.length){
        return -1;
        }
    }
     return 0;
  
}
function sortLib(a,b) {
//sort descending


if(order=='bigFirst'){
    if (a.getYield() < b.getYield()) {
        return 1;
      }else if (a.getYield() > b.getYield()) {
        return -1;
      }

}else if(order=='fastFirst'){
    if (a.signup < b.signup) {
        return 1;
      }else if (a.signup > b.signup) {
        return -1;
      }
}
      //add another weighing scale

      return 0;
  
   
}
function getNextBook() {
  var books = booksLeft.filter(e=>{//filter non reg libs
    return !e.reg;
  }).filter(e=>{//has to have a lib
    return e.libs.length>0;
  }).sort(sortBook);

   return books[0];
}
function knapsack() {
    function registerByLib() {

      let  currentLib =null;
      while ( (currentLib = getNextLib())!=null && daysLeft>= 0){

        currentLib.mine(true);//start mining 
        //q.defer(currentLib.mine,true);
      
          // q.await(function(error) {
          // 	console.log(error);
          // });
         
      }

      console.log(`no more libsLeft ${libOrder.length} /${libsLeft.length} days:${daysLeft}`);
    }
    function registerByBook() {

      let  currentBook=null;
      while ( (currentBook = getNextBook())!=null && daysLeft>= 0){

        var remainingLibs = currentBook.getRemainingLibs();

        if(remainingLibs.length>0){
          console.log(`currentBook ${currentBook.pos} in libs: ${remainingLibs.length}/ ${currentBook.libs.length} days: ${daysLeft}`);
          remainingLibs[0].mine(true);//start mining 
        }else{
            var libs = libsLeft.filter(e=>{//filter my libs
                return currentBook.libs.includes(e.pos);
              }).reduce((total,e)=>{
             return total + "e.lib:"+e.pos +" days: "+e.signup+ " yield:"+e.getYield()
              },'')
          console.log(`out of libs to mine this book: ${currentBook.pos} marks:  ${currentBook.v} libs: ${currentBook.libs.length} data: ${libs} daysleft: ${daysLeft}`);
          currentBook.reg=true;//make it get skipped
        }
       
        //q.defer(currentLib.mine,true);
      
          // q.await(function(error) {
          // 	console.log(error);
          // });
         
      }
      console.log(`no more booksLeft ${bookOrder.length} /${booksLeft.length} days:${daysLeft}`);
    }

    //countdown days
//   for (var x = 0; x < days; x++) {
//     console.log(`day ${x}/${days}`);
//     daysLeft = days - x;

//   }
//registerByLib()
registerByBook()
  //output
  output();
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
  fs.writeFileSync(myArgs[0] + "_" + myArgs[1] + "_" + myArgs[2]+ ".out", answer);

  console.timeEnd("script");
  process.exit()
}

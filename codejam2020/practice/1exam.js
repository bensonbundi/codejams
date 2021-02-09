process.stdin.resume();
process.stdin.setEncoding('utf-8');

var __input_stdin = "";
var __input_stdin_array = "";
var __input_currentline = 0;

process.stdin.on('data', function (data) {
    __input_stdin += data;
});

/*
 * Complete the function below.
 * Use console.log to print the result, you should not return from the function.
 * https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page=[topic]
 */
function getTopicCount(topic) {
    count = 0;
	const https = require('https');
    let request_call = new Promise((resolve, reject) => {
    https.get('https://en.wikipedia.org/w/api.php?action=parse&section=0&prop=text&format=json&page='+topic, (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
    //console.log(data);

  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(JSON.parse(data).parse.text["*"]);

var count = (JSON.parse(data).parse.text["*"].match(new RegExp("str", "g")) || []).length;
    console.log(count);

resolve(count);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
  reject(err);
});
   });

(async function () {
    // wait to http request to finish
   return await request_call;
    
    
})();

}
process.stdin.on('end', function () {
    __input_stdin_array = __input_stdin.split("\n");
    var _topic = __input_stdin_array[__input_currentline].trim();
    __input_currentline += 1;
    
    getTopicCount(_topic);
});

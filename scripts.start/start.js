var exec = require('child_process').exec;

var debug = exec(`node-debug --web-host 0.0.0.0 --save-live-edit true -p 5959 -d 6060 index.js`),
    nodemon = exec('node --debug=6060 index.js');


var output_func = function(data){

  var buff = new Buffer(data);
  console.log(buff.toString('utf8'));

}

var rt = [debug, nodemon];

//console.log(rt);

rt.forEach(function(n){
  n.stdout.on('data', output_func);
  n.stderr.on('data', output_func);
});

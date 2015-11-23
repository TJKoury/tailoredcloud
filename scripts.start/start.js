var spawn = require('child_process').spawn,
    debug = spawn('node-debug',
       ['--web-host',
	'107.170.149.178',
	'--save-live-edit',
	'true', 
	'-p', 
	'5959', 
	'-d', 
	'6060', 
	'index.js']),
    nodemon = spawn('nodemon', 
	['--debug', 
	 'index.js']);

    
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
    

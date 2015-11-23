var os = require('os'),
exec = require('child_process').exec,
spawn = require('child_process').spawn,
scripts = [];

if(os.platform().indexOf('win')<0){
  scripts.push(spawn('chmod',['-R','+x', '../scripts*/*']));
  scripts.push(spawn('./npm-g-nosudo.sh'));
}

scripts.push(spawn('npm', ['install', '-g', 'nodemon']));
scripts.push(spawn('npm', [,'install','-g', 'node-inspector']));

var output_func = function(data){
  var buff = new Buffer(data);
  console.log(buff.toString('utf8'));
}

scripts.forEach(function(n){
  n.stdout.on('data', output_func);
  n.stderr.on('data', output_func);
});
    
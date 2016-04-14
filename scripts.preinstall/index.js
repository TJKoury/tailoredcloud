var os = require('os'),
fs = require('fs'),
exec = require('child_process').exec,
spawn = require('child_process').spawn,
settings = require('package.json'),
createcert = require('./createcert.js'),
path = require('path'),
scripts = [];

if(!fs.existSync(settings.servercertificate.certificate)){
  createcert.createcert(path.join(process.cwd(), '../',settings.servercertificate.certificate));
}

if(os.platform().indexOf('win')<0){
  scripts.push(exec('chmod -R +x ../scripts*/*'));
  scripts.push(exec('./npm-g-nosudo.sh'));
}

scripts.push(exec('npm install -g nodemon'));
scripts.push(exec('npm install -g node-inspector'));

var output_func = function(data){
  var buff = new Buffer(data);
  console.log(buff.toString('utf8'));
}

scripts.forEach(function(n){
  n.stdout.on('data', output_func);
  n.stderr.on('data', output_func);
});

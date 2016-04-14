exec = require('child_process').exec;

module.exports = {
  createcert:function(path, cb){
      path = path||'private_key.pem';
      var t = exec('openssl genrsa -out '+path+' 2048');
      t.on('exit', (exitCode)=>{
        console.log('exited');
        cb();
      })
  }
};

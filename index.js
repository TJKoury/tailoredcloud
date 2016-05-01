

    var http = require('http');
    var https = require('https');
    var vhost = require('vhost');
    var fs = require('fs');
    var path = require('path');
    var express = require('express');
    var app = express();
    var static = './static';
    var pem = require('pem');
    var settings = require('./settings.js');

    var env = (__dirname === settings.dir.dev||settings.environment === "dev")?'dev':'prod';
    var ports = settings.ports[env];

    if(env === 'dev'){
        app.use(function(req,res, next){
          console.log(req.host);

          res.header('Refresh','60;url=/');
          next();

        });
    };

    fs.readdirSync(static).forEach(function(host){
       console.log(path.join(__dirname, static, host));
       app.use(vhost(host, express.static(path.join(__dirname, static, host))));
    });



   app.use("/", function(req, res, next){
        res.end('NO DOMAIN');
    })

    console.log(ports.http);
    console.log(ports.https);

    http.createServer(app).listen(ports.http);

    if(env === 'dev'){
      pem.createCertificate({days:1, selfSigned:true}, function(err, keys){
        https.createServer({key: keys.serviceKey, cert: keys.certificate}, app)
        .listen(ports.https);
    });
    }else{
      https.createServer({
          pfx: fs.readFileSync('/opt/certificates/server.pfx'),
          passphrase: require('/opt/certificates/passphrase.js').passphrase,
          requestCert: false,
          // If specified as "true", no unauthenticated traffic
          // will make it to the route specified.
          rejectUnauthorized: false
          }, app).listen(ports.https);
    }

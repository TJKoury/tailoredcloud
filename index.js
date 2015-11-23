
    
    var http = require('http');
    var https = require('https');
    var vhost = require('vhost');
    var fs = require('fs');
    var path = require('path');
    var express = require('express');
    var app = express();
    var static = './static';
    
    var settings = require('./settings.js');
    
    var environment = (__dirname === settings.dir.development)?'development':'production';
    var ports = settings.ports[environment];
    
    if(__dirname === settings.dir.development){
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
    https.createServer({
         pfx: fs.readFileSync('/opt/certificates/server.pfx'),
        passphrase: require('/opt/certificates/passphrase.js').passphrase,
        requestCert: false,
        // If specified as "true", no unauthenticated traffic
        // will make it to the route specified.
        rejectUnauthorized: false
        }, app).listen(ports.https);

    

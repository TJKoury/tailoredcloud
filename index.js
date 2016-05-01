

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
    var cluster = require('cluster');
    var numCPUs = 1;//require('os').cpus().length;

    var env = (__dirname === settings.dir.prod||settings.environment === "prod")?'prod':'dev';
    var ports = settings.ports[env];

    if (cluster.isMaster) {
        console.log(`\tTailored Cloud Dev Environment \n
        `+new Date()+`\n
        HTTP :`+ports.http+`\n
        HTTPS:`+ports.https+`\n`);
        // Fork workers.
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        fs.watch('static', function(){
            for (var id in cluster.workers) {
                cluster.workers[id].kill();
            }
        });
        
        cluster.on('exit', function(worker, code, signal){
            console.log(`worker ${worker.process.pid} died`);
            cluster.fork();
        });
    } else {

        if(env === 'dev'){
            
            app.use(function(req,res, next){
                res.header('Refresh','1;url=/');
                next();
            });
        };

        fs.readdirSync(static).forEach(function(host){
 
        app.use(vhost(host, express.static(path.join(__dirname, static, host))));
        });

        app.use("/", function(req, res, next){
            res.end('NO DOMAIN');
        })

        http.createServer(app).listen(ports.http);

        if(env === 'dev'){
            
        pem.createCertificate({days:1, selfSigned:true}, function(err, keys){
           var _server = https.createServer({key: keys.serviceKey, cert: keys.certificate}, app)
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
    }
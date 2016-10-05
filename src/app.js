/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
httpsPort = 4400;
httpPort = 9000;
var express = require('express'),
    app = express();

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" // Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs

//configure express further
var config = require('./server/config/config'); //may pass env later
var properties = require ('./server/lib/envProperties');
require('./server/config/express')(app, config);
//mongoose goes here
// passport goes here
require('./server/config/mongoose')(config);

require('./server/config/passport')();

require('./server/config/routes.js')(app);

var moment = require('moment');

if(properties.USESSL == 'false')
{
    app.listen(httpPort);
    console.log('Express server listening on port ' + httpPort); 
}

else if (properties.USESSL == 'true')
{
//HTTPS 
    var https = require('https'),      // module for https
        fs =    require('fs');         // required to read certs and keys

    var options = {
        key:    fs.readFileSync(properties.SSL_KEY),
        cert:   fs.readFileSync(properties.SSL_CERT),
        ca:     fs.readFileSync(properties.SSL_BUNDLE),
        requestCert:        false,
        rejectUnauthorized: false,
};

https.createServer(options, app).listen(httpsPort);
console.log('HTTPS Express server listening on port ' + httpsPort); 

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    //res.writeHead(301, { "Location": "https://localhost:4400" });
    res.end();
}).listen(httpPort);

console.log('Redirector listening on port ' + httpPort); 
}
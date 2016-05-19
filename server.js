var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
eval(fs.readFileSync('server/serverClass.js') + '');


var server = new serverClass();
server.create();
server.run();

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port = process.env.PORT || 8080;

if (typeof ipaddress === "undefined") {
	console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1. PORT: ' + port);
	ipaddress = "127.0.0.1";
};

app.use(express.static(__dirname + '/client'));
http.listen(port);

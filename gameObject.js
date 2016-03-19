var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);



app.use(express.static(__dirname + '/client'));

io.on('connection', function (socket) {
	

	console.log("Somebody connected!");
	
	
	socket.on('name', function (msg) {
		console.log('New: ' + msg);
	//	socket.broadcast.emit('new', "new");
		io.emit('new', "new");
	});


  // Write your code here
});

var  ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var  port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

if (typeof ipaddress === "undefined") {
	//  Log errors on OpenShift but continue w/ 127.0.0.1 - this
	//  allows us to run/test the app locally.
	console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
	ipaddress = "127.0.0.1";
};

http.listen(port, ipaddress, function () {
	console.log("Server is listening on port " + port);
});



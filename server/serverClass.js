

eval(fs.readFileSync('client/shared/const.js') + '');
eval(fs.readFileSync('server/gameObject.js') + '');
eval(fs.readFileSync('client/shared/map.js') + '');


serverClass = function () {
	
	this.objects = [];
	this.delta = 0;
	this.lastTime = new Date().getTime();
	this.map = new CMap();
	
	this.timeLeft = 59;
	this.matchTime = 59;
	this.numPlayers = 5;

}


serverClass.prototype.reset = function () {
	for (var a = 0; a < this.numPlayers; a++)
		this.objects[a].score = 0;

	this.map.reset();
	this.timeLeft = 65;
	io.emit("reset", this.timeLeft);
}


serverClass.prototype.create = function () {
	
	this.map.serverCreate();
	
	var col = ["red", "blue", "green", "yellow", "white"];
	
	for (var a = 0; a < this.numPlayers; a++) {
		this.objects.push(new gameObject(5 + a, 4, col[a] ,a));
	}
	
}

function servUpdate() {
	server.update();	
}
serverClass.prototype.run = function () {
	
	this.map.serverCreate();
	var self = this;
	setInterval(servUpdate, 25);
	setInterval(this.sendState, 40);
	setInterval(function () { server.timeLeft--; }, 1000);
	setInterval(this.addBonus, 400);

io.on('connection', function (socket) {
	
	var player=0;
	
	
	socket.on('join', function (msg) {
		
		for (var a = 0; a < server.objects.length; a++)
				if (server.objects[a].ai) {
					
					player = server.objects[a];
					player.socket = socket;
					player.id = a;
				player.ai = 0;
				player.name = msg;
				console.log("New connection. ID: " + a + "; Name: "+msg);
				break;
			}
		
			socket.broadcast.emit('new', player.id+"+"+player.name);
			var init = player.id + "+" + server.numPlayers + "+" + server.timeLeft + "+";
			for (var a = 0; a < server.objects.length; a++) {
				init += server.objects[a].aimX + "$";
				init += server.objects[a].aimY + "$";
				init += server.objects[a].color + "$";
				init += server.objects[a].name + "$";
				init += server.objects[a].angle + "$";
			}
		
		socket.emit('init', init);
	});
		

		socket.on('disconnect', function () {
			if (player === 0) return;
			server.objects[player.id].ai = 1;
			console.log(player.name + " disconeccted");
		});


		socket.on('p', function (msgo) {
			msg = msgo.split("+");
			player.aimX = msg[0];
			player.aimY = msg[1];
			player.angle = msg[2];
			

			player.checkField(msg[0], msg[1]);
			socket.broadcast.emit('p', player.id + "+" + msgo);
		});

});
}

serverClass.prototype.sendState = function () {
	
	var msg="";
	for (var x = 0; x < server.map.fieldsX; x++)
		for (var y = 0; y < server.map.fieldsY; y++) {
			msg += server.map.fields[x][y].color;
			if (server.map.fields[x][y].bonus == BONUS_AI) msg += '0';
			else msg += server.map.fields[x][y].bonus;
		}
	io.emit("state", msg);
//	console.log(msg);
}


serverClass.prototype.addBonus = function () {
	
	if (this.timeLeft > this.matchTime) return; 
	var msg = "";
	var x = Math.floor((Math.random() * server.map.fieldsX));
	var y = Math.floor((Math.random() * server.map.fieldsY));
	
	var bonus = BONUS_AI;
	var rand = Math.random();
	

	if (rand > 0.2) bonus = BONUS_SCORE;
	if (rand > 0.6) bonus = BONUS_SPEED;

	server.map.fields[x][y].bonus = bonus;
//	console.log(msg);
}


serverClass.prototype.update = function () {
	
	
	this.delta = (new Date().getTime() - this.lastTime) / 1000.0;
	this.lastTime = new Date().getTime();
	

	
	for (var i = 0; i < this.objects.length;  i++) {
		this.objects[i].update();

	}
	
	for (var x = 0; x < server.map.fieldsX; x++)
		for (var y = 0; y < server.map.fieldsY; y++)
			server.map.fields[x][y].claimed -= this.delta;

	if (this.timeLeft == 0)
		this.reset();
}
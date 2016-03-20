

eval(fs.readFileSync('client/shared/const.js') + '');
eval(fs.readFileSync('server/gameObject.js') + '');
eval(fs.readFileSync('client/shared/map.js') + '');

CWinner = function (name, wins) {

	this.name = name;
	this.wins = wins;
}

serverClass = function () {
	
	this.objects = [];
	this.delta = 0;
	this.lastTime = new Date().getTime();
	this.map = new CMap();
	
	this.timeLeft = 59;
	this.matchTime = 59;
	this.numPlayers = 5;
	
	this.hallOfFame = [];

}

serverClass.prototype.sendHallOfFame = function () {
	
	var msg = "" + this.hallOfFame.length;
	
	
	this.hallOfFame.sort(function (a, b) {
		return parseInt(b.wins) - parseInt(a.wins);
	});
	

	for (var a = 0; a < this.hallOfFame.length; a++) {
		msg+= "+" + this.hallOfFame[a].name + "+" + this.hallOfFame[a].wins;
	}
	console.log(msg);
	io.emit("hof", msg);

}

serverClass.prototype.addToHOF = function (name, win) {

	var added = 0;
	for (var a = 0; a < this.hallOfFame.length; a++)
		if (this.hallOfFame[a].name.toLowerCase() == name.toLowerCase()) {
			added = 1;
			this.hallOfFame[a].wins+=win;
		}
	if (!added)
		this.hallOfFame.push(new CWinner(name, win));

}

serverClass.prototype.reset = function () {
	
	var best = 0, second = 0, third = 0, forth = 0;
	var scores = [];
	for (var a = 0; a < this.numPlayers; a++)
		scores.push([this.objects[a].name, this.objects[a].score, this.objects[a].ai]);
	
scores.sort(function (a, b) {
	return parseInt(a[1]) - parseInt(b[1]);
});


	for (var a = 0; a < this.numPlayers; a++) {
		if (scores[a][2] == false) this.addToHOF(scores[a][0], a);
		console.log(scores[a][1]+" ");
	}

	for (var a = 0; a < this.numPlayers; a++) {
		this.objects[a].score = 0;
	}
	this.map.reset();
	this.timeLeft = 65;
	
	io.emit("reset", this.timeLeft + "+" + scores[4][0]);
	this.sendHallOfFame();
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
			setTimeout(function () { socket.emit('init', init); server.sendHallOfFame();}, 500);
		
	});
		

		socket.on('disconnect', function () {
			if (player === 0) return;
			server.objects[player.id].ai = 1;
			server.objects[player.id].name = "Bot";
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
	

	if (rand > 0.1) bonus = BONUS_SCORE;
	if (rand > 0.5) bonus = BONUS_SPEED;
	if (rand > 0.7) bonus = BONUS_ARROW;
	if (rand > 0.86) bonus = BONUS_WIRUS;
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
		for (var y = 0; y < server.map.fieldsY; y++) {
			server.map.fields[x][y].claimed -= this.delta;

			if (server.map.fields[x][y].bonus == BONUS_ARROW) {
				server.map.fields[x][y].arrowTimer += server.delta;
				if (server.map.fields[x][y].arrowTimer > _arrowRotationTime) {
					server.map.fields[x][y].arrowTimer = 0;
					server.map.fields[x][y].arrowDir = (server.map.fields[x][y].arrowDir + 1) % 4;
				}
			}

		}
	

	if (this.timeLeft == 0)
		this.reset();
}
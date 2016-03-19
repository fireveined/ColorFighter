


gameClass.prototype.update = function () {
	
	if (this.map.objects.length == 0) return;
	this.delta = phaser.time.elapsed / 1000.0;
	this.delta = Math.min(this.delta, 0.1);
	
	this.delta = phaser.time.physicsElapsed;
	phaser.debug.text('fps: ' + phaser.time.fps, 20, 20, 'yellow');

	this.map.update();
	
	

	this.manageInput();



	//hud
	
	game.avatars[0].time.setText("0:"+this.timeLeft);
	for (var a = 0; a < this.numPlayers; a++) {
		this.avatars[a].score.setText(this.map.objects[a].score);
	}
};



gameClass.prototype.manageInput = function () {
	
	var angle = -1;
	if (this.keys["up"].isDown)angle=0 ;
	if (this.keys["down"].isDown) angle = 180;
	if (this.keys["left"].isDown) angle = 270;
	if (this.keys["right"].isDown) angle = 90;
	
	

	if (angle != -1) {
		this.getPlayer().rotate(angle);
	}

	//if (this.keys["space"].isDown) this.objects[0].shot(0);
}






gameClass.prototype.handleNetwork = function (socket) {



	var self = this;
	socket.on('init', function (msg) {
		
		self.loaded = 1;
		msg = msg.split("+");
		
		self.playerId = msg[0];
		
		self.numPlayers = msg[1];
		self.timeLeft = parseInt(msg[2]);
		var players = msg[3].split("$");
		for (var a = 0; a < self.numPlayers; a++) {
			self.addPlayer(players[a * 5 + 0], players[a * 5 + 1], players[a * 5 + 2], players[a * 5 + 3]);
			self.map.objects[a].nextAngle = players[a * 5 + 4];
		}
		self.map.objects[self.playerId].player = 1;
		self.avatars[0].time = phaser.add.text(hudX + 30, 10, "0:52", { fill: "yellow" });
	});




	socket.on('p', function (msg) {
		if (!self.loaded) return;		
		console.log(msg);
		msg = msg.split("+");
		self.map.objects[msg[0]].pos.push(new CState(msg[1], msg[2], msg[3]));
	});
	
	/*
	socket.on('bonus', function (msg) {
		if (!self.loaded) return;
		console.log(msg);
		msg = msg.split("+");
		game.map.fields[msg[0]][msg[1]].field.bonus = msg[2];
		game.map.fields[msg[0]][msg[1]].field.bonusSprite = phaser.add.image(msg[0]*game.map.fieldSize, msg[1] * game.map.fieldSize, "bonus", msg[2]-1);
		
	});
	*/

	socket.on('state', function (msg) {
		if (!self.loaded) return;	
		console.log(msg);
		var i = 0;
		msg = msg.split("");		
		for (var x = 0; x < game.map.fieldsX; x++)
			for (var y = 0; y < game.map.fieldsY; y++) {
				self.map.fields[x][y].setColor(msg[i]); i++;
				self.map.fields[x][y].setBonus(msg[i]);
				i++;
	}
	
	});
	

	socket.on('score', function (msg) {
		if (!self.loaded) return;
		msg = msg.split("+");
		game.map.objects[msg[0]].score=msg[1];
	});


	socket.on('reset', function (msg) {
		if (!self.loaded) return;
		game.timeLeft = parseInt(59);;
		
		for (var a = 0; a < self.numPlayers; a++) {
			game.map.objects[a].score = 0;
		}
		game.map.reset();
	});
}
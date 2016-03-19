
gameObject = function (x, y, color, id) {
	
	this.posX = (x+0.5)*server.map.fieldSize;
	this.posY = (y + 0.5) * server.map.fieldSize;;
	this.aimX = this.posX;
	this.aimY = this.posY;
	this.color = color;
	this.speed = _playerSpeed;
	this.name = "Bot";
	this.id = id;
	this.ai = 1;
	this.socket = 0;
	this.angle = 0;
	this.shortColor = color.substr(0, 1);
	this.score = 0;

	this.bonusSpeed = 0;
	}



gameObject.prototype.checkField = function (x, y) {

	var field = server.map.getField(x,y);
	if (field.bonus == BONUS_SCORE) {
		this.score += server.map.scoreFields(this.shortColor);
		var msg = this.id + "+" + this.score;
		io.emit("score", msg);
	}
	
	if (field.bonus == BONUS_SPEED) {
		this.bonusSpeed = _bonusSpeed;
	//	if (this.ai) this.bonusSpeed = _aiBonusSpeed;
		var msg = this.id + "+" + this.bonusSpeed;
		io.emit("bonus_s", msg);
		var self = this;
		setTimeout(function () { self.bonusSpeed = 0;},2000);
	}

	field.bonus = 0;
	if (server.timeLeft < server.matchTime)
	field.setColor(this.shortColor);

}

function getDistance(x1, y1, x2, y2) {
	return Math.sqrt( Math.pow(x1-x2,2) + Math.pow(y1 - y2, 2));
}

gameObject.prototype.serachForBonus = function () {
	
	
	var pos = { x: 9999, y: 9999 };

	for (var x = 0; x < server.map.fieldsX; x++)
		for (var y = 0; y < server.map.fieldsY; y++)
			if (server.map.fields[x][y].bonus > 0 && (server.map.fields[x][y].claimed<0 || server.map.fields[x][y].claimedBy==this.id))
				if (getDistance(x, y, this.posX / server.map.fieldSize, this.posY / this.posX / server.map.fieldSize) <
					getDistance(pos.x, pos.y, this.posX / server.map.fieldSize, this.posY / this.posX / server.map.fieldSize)) {
					pos.x = x; pos.y = y;
				}
	
	if (pos.x == 9999) {
		pos.x = parseInt(Math.random() * 15);
		pos.y = parseInt(Math.random() * 11);
	}
	else {
		server.map.fields[pos.x][pos.y].claimed = 1;
		server.map.fields[pos.x][pos.y].claimedBy = this.id;
	}
	return pos;
}


	gameObject.prototype.update = function () {

	
	var fsize = server.map.fieldSize;
	
	var odx = Math.abs(this.aimX- this.posX);
	var ody = Math.abs(this.aimY - this.posY);
	
	if (odx < 14 && ody < 14) {
		
		this.checkField(this.posX, this.posY);
		
		//ai movement
		if (this.ai) {
			var npos = this.serachForBonus();
			var tposx = parseInt(this.posX / server.map.fieldSize);
			var tposy = parseInt(this.posY / server.map.fieldSize);
			var r = Math.random();
			
			if (npos.y == tposy || r > 0.5) {
				if (npos.x > tposx) if (this.aimX + fsize < server.map.mapWidth) { this.aimX += fsize; this.angle = 90; }
				if (npos.x < tposx) if (this.aimX - fsize > 0) { this.aimX -= fsize; this.angle = 270; }
			}
			
			if (npos.x == tposx || r < 0.5) {
				if (npos.y > tposy) if (this.aimY + fsize < server.map.mapHeight) { this.aimY += fsize; this.angle = 180; }
				if (npos.y < tposy) if (this.aimY - fsize > 0) { this.aimY -= fsize; this.angle = 0; }
			}

			var msg = this.id + "+" + this.aimX + "+" + this.aimY + "+" + this.angle;
			io.emit("p", msg);
		}
		else {
			this.angle = this.nextAngle;
			if (this.angle == 0) { if (this.aimY - fsize > 0) this.aimY -= fsize; }
			if (this.angle == 90) { if (npos.x > tposx) if (this.aimX + fsize < server.map.mapWidth) this.aimX += fsize; }
			if (this.angle == 180) { if (this.aimY + fsize < server.map.mapHeight) { this.aimY += fsize; } }
			if (this.angle == 270) { if (this.aimX - fsize > 0) this.aimX -= fsize; }
			
		}


	}

	var speed = this.speed;
	if (this.bonusSpeed > 0) {
		speed += this.bonusSpeed;
	//	this.bonusSpeed -= _bonusSpeedScale * server.delta;
	}	

	if (this.aimY < this.posY) this.posY -= speed * server.delta;
	if (this.aimX > this.posX) this.posX += speed * server.delta;
	if (this.aimY > this.posY) { this.posY += speed * server.delta; }
	if (this.aimX < this.posX) this.posX -= speed * server.delta;

	}

gameObject = function (x, y, color, id) {
	
	this.posX = (x+0.5)*server.map.fieldSize;
	this.posY = (y + 0.5) * server.map.fieldSize;;
	this.aimX = this.posX;
	this.aimY = this.posY;
	this.color = color;
	this.speed = 250;
	this.name = "Bot";
	this.id = id;
	this.ai = 1;
	this.socket = 0;
	this.angle = 0;
	this.shortColor = color.substr(0, 1);
	this.score = 0;
	}



gameObject.prototype.checkField = function (x, y) {

	var field = server.map.getField(x,y);
	if (field.bonus == 1) {
		field.bonus = 0;
		this.score += server.map.scoreFields(this.shortColor);

		var msg = this.id + "+" + this.score;
		io.emit("score", msg);

	}
	
	field.setColor(this.shortColor);

}



	gameObject.prototype.update = function () {

	
	var fsize = server.map.fieldSize;
	
	var odx = Math.abs(this.aimX- this.posX);
	var ody = Math.abs(this.aimY - this.posY);
	
	if (odx < 14 && ody < 14) {
		
		this.checkField(this.posX, this.posY);

		this.angle = this.nextAngle;
		if (this.angle == 0) { if (this.aimY - fsize > 0) this.aimY -= fsize;}
		if (this.angle == 90) { if (this.aimX + fsize < server.map.mapWidth) this.aimX += fsize; }
		if (this.angle == 180) { if (this.aimY + fsize < server.map.mapHeight) { this.aimY += fsize; } }
		if (this.angle == 270) { if (this.aimX - fsize > 0) this.aimX -= fsize; }
		
		 odx = Math.abs(this.aimX - this.posX);
		 ody = Math.abs(this.aimY - this.posY);
		if (odx > 5 || ody > 5) {
			if (this.ai) {
				var msg = this.id + "+" + this.aimX + "+" + this.aimY + "+" + this.angle;
				io.emit("p", msg);
			}
		}

	}
	
	var r = Math.random();
	if (this.ai)
		if (r > 0.9) this.nextAngle = 90;
		else if (r > 0.8) this.nextAngle = 180;
		else if (r > 0.7) this.nextAngle = 270;
else if (r > 0.6) this.nextAngle = 0;

	var speed = this.speed;
	
	if (this.aimY < this.posY) this.posY -= speed * server.delta;
	if (this.aimX > this.posX) this.posX += speed * server.delta;
	if (this.aimY > this.posY) { this.posY += speed * server.delta; }
	if (this.aimX < this.posX) this.posX -= speed * server.delta;

	}
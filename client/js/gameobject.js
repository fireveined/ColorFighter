
function CState(x, y, angle) {

	this.x = parseInt(x);
	this.y = parseInt(y);
	this.angle = angle;
}


function gameObject(position, color) {
	var self = this;

	this.angle = 0;
	this.nextAngle = 180;
	this.pos = [new CState(parseInt(position.x), parseInt(position.y), this.nextAngle)];
	this.speed = _playerSpeed;
	this.bonusSpeed = 0;
	this.bonusTimer = 0;
	this.wirusTimer = 0;

	if (color == "red") {
		this.color = RGBtoHEX(125, 0, 0);
		this.icon = 0;
	}

	if (color == "green") {
		this.color = RGBtoHEX(0, 125, 0);
		this.icon = 2;
	}

	if (color == "blue") {
		this.color = RGBtoHEX(0, 0, 125);
		this.icon = 1;
	}

	if (color == "yellow") {
		this.color = RGBtoHEX(180, 60, 0);
		this.icon = 4;
	}

	if (color == "white") {
		this.color = RGBtoHEX(40, 40, 40);
		this.icon = 3;
	}

	this.sprite = phaser.add.sprite(this.pos[0].x, this.pos[0].y, 'ships', this.icon);
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;

	this.counter = phaser.add.text(25, 30, "", { fill: "yellow", fontSize: 24 });
	this.counter.setShadow(5, 5, 'rgba(0,0,0,0.6)', 2);
	this.cooldowns = [[1, 1], [1, 1], [1, 1]];

	this.health = [45, 60];
	this.acceleration = 0;
	this.score = 0;
	this.moving = 0;
	this.id = 0;
	this.shortColor = color.substr(0, 1);
	this.player = 0;
}

gameObject.prototype.checkField = function (x, y) {

	var field = game.map.getField(x, y);
	if (field.bonus == BONUS_SCORE) {
		field.field.bonus = 0;
		field.field.bonusSprite.destroy(true);
		game.map.claimFields(this.shortColor, "n");
	}

	if (game.timeLeft < game.matchTime)
		field.setColor(this.shortColor);
}

gameObject.prototype.update = function () {

	this.wirusTimer -= game.delta;
	this.bonusTimer -= game.delta;

	if (this.wirusTimer > 0)
		this.counter.setText(parseInt(this.wirusTimer + 1));
	else
		this.counter.setText("");

	var posx = this.pos[0].x;
	var posy = this.pos[0].y;

	this.counter.position.x = this.sprite.position.x - 5;
	this.counter.position.y = this.sprite.position.y - 14;

	var sx = this.sprite.position.x;
	var sy = this.sprite.position.y;
	var odx = Math.abs(sx - posx);
	var ody = Math.abs(sy - posy);

	var fsize = game.map.fieldSize;

	var o = 12;
	if (this.ai) o = 19;
	if (this.pos.length > 5) this.pos.splice(0, this.pos.length - 5);
	if (this.pos.length > 2) o = 19;
	if (odx < o && ody < o) {

		this.checkField(posx, posy);

		if (this.pos.length > 1)
			this.pos.splice(0, 1);
		else {
			this.pos[0].angle = this.nextAngle;
			if (this.nextAngle == 0) { if (posy - fsize > 0) this.pos[0].y -= fsize; }
			if (this.nextAngle == 90) { if (posx + fsize < game.map.mapWidth) this.pos[0].x += fsize; }
			if (this.nextAngle == 180) { if (posy + fsize < game.map.mapHeight) { this.pos[0].y += fsize; } }
			if (this.nextAngle == 270) { if (posx - fsize > 0) this.pos[0].x -= fsize; }

			odx = Math.abs(sx - this.pos[0].x);
			ody = Math.abs(sy - this.pos[0].y);

			if (this.player)
				if (odx > 5 || ody > 5) {
					var msg = this.pos[0].x + "+" + this.pos[0].y + "+" + this.pos[0].angle;
					socket.emit('p', msg);
				}
		}

		this.angle = this.pos[0].angle;
		this.sprite.rotation = this.angle / 180 * Math.PI;
		this.nextAngle = this.angle;
	}


	posx = this.pos[0].x;
	posy = this.pos[0].y;

	var speed = this.speed;
	if (this.ai) speed *= 1.2;
	if (this.bonusSpeed > 0 && this.bonusTimer > 0) {
		speed += this.bonusSpeed;
	}

	if (this.pos.length > 3) speed *= 3;
	if (this.pos.length > 0) {
		if (posy < this.sprite.position.y) { this.sprite.position.y -= speed * game.delta; }
		if (posx > this.sprite.position.x) { this.sprite.position.x += speed * game.delta; }
		if (posy > this.sprite.position.y) { this.sprite.position.y += speed * game.delta; }
		if (posx < this.sprite.position.x) { this.sprite.position.x -= speed * game.delta; }
	}
};

gameObject.prototype.rotate = function (angle) {
	this.nextAngle = angle;
};
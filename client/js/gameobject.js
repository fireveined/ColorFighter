
function CState(x, y, angle) {
	
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.angle = angle
}


function gameObject(position, color) {
	var self = this;
	
	this.angle = 0;
	this.nextAngle = 180;
	this.pos = [new CState(parseInt(position.x), parseInt(position.y), this.nextAngle)];
	this.speed = 250;
	
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
	
	
	this.sprite = phaser.add.sprite(this.pos[0].x , this.pos[0].y, 'ships', this.icon );
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	
	
	this.cooldowns = [[1, 1], [1, 1], [1, 1]];
	
	this.health = [45, 60];
	
	this.acceleration = 0;
	
	this.score = 0;
	
	this.moving = 0;
	
	
	this.shortColor = color.substr(0, 1);
	
	this.player = 0;
}


gameObject.prototype.shot = function (skill) {
	/*
	if (this.cooldowns[skill][0] < 0) {
		
		game.objects.push(new missle(Object.assign({}, this.position), phaser.physics.arcade.angleBetween(this.sprite, phaser.input.mousePointer)+Math.PI/2, "fireball"));
		this.cooldowns[skill][0] = this.cooldowns[skill][1];
	}
	  */
};


gameObject.prototype.update = function () {
	
	
	var posx = this.pos[0].x;
	var posy = this.pos[0].y;
	
	var sx = this.sprite.position.x;
	var sy = this.sprite.position.y;
	var odx = Math.abs(sx - posx);
	var ody = Math.abs(sy - posy);
	
	var fsize = game.map.fieldSize;
	
	var odx2 = (this.sprite.position.x + fsize / 2) % fsize;
	var ody2 = (this.sprite.position.y + fsize / 2) % fsize;
	if ((odx2 < 6 || odx2 > 54) && (ody2 < 6 || ody2 > 54)) {

	}
	
	var o = 5;
	if (this.pos.length > 5) this.pos.splice(0, this.pos.length-5);
	if (this.pos.length > 1) o = 13;
	if (odx < o && ody < o) {
		
		var field = game.map.getField(posx - 15, posy - 15);
		
		if (field.field.bonus == 1) {
			field.field.bonus = 0;
			field.field.bonusSprite.destroy(true);
			game.map.scoreFields(this.shortColor);
		}
		
		field.setColor(this.shortColor);
		
		
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
			
			console.log(this.pos[0].y);
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
	
	
	var posx = this.pos[0].x;
	var posy = this.pos[0].y;
	
	var speed = this.speed;
	
	if (this.pos.length > 1) speed *= 3;
	if (posy < this.sprite.position.y) { this.sprite.position.y -= speed * game.delta; }
	if (posx > this.sprite.position.x) { this.sprite.position.x += speed * game.delta; }
	if (posy > this.sprite.position.y) { this.sprite.position.y += speed * game.delta; }
	if (posx < this.sprite.position.x) { this.sprite.position.x -= speed * game.delta; }
	


};


gameObject.prototype.rotate = function (angle) {
	
	this.nextAngle = angle;
};


function gameObject(position, sprite) {
	var self = this;
	this.position = position;
	this.speed = 1.4;
	this.angle = 0;

	this.sprite = phaser.add.sprite(this.position.x, this.position.y, 'body');
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	
	
	this.face = this.sprite.addChild(phaser.make.image(7, -43, 'faces', 0));
	this.face.anchor.x = 0.5;
	this.face.anchor.y = 0.5;

	this.legs = this.sprite.addChild(phaser.make.sprite(0, 38, 'legs'));
	this.legs.animations.add('move');
	this.legs.animations.play('move', 9, true);
	this.legs.anchor.x = 0.5;
	this.legs.anchor.y = 0.5;
	//this.face = phaser.add.image(this.position.x, this.position.y, "faces", 1);
	//this.face.anchor.x = 0.5;
	//this.face.anchor.y = 0.5;

	this.moving = 0;
	this.direction = 1;

	this.cooldowns = [[1, 1], [1, 1], [1, 1]];

	this.health = [45,60];
}


gameObject.prototype.shot = function (skill) {
	if (this.cooldowns[skill][0] < 0) {
		
		game.objects.push(new missle(Object.assign({}, this.position), phaser.physics.arcade.angleBetween(this.sprite, phaser.input.mousePointer)+Math.PI/2, "fireball"));
		this.cooldowns[skill][0] = this.cooldowns[skill][1];
	}
};

gameObject.prototype.update = function () {

	this.cooldowns[0][0] -= phaser.time.elapsed / 1000;
	this.cooldowns[1][0] -= phaser.time.elapsed / 1000;
	this.cooldowns[2][0] -= phaser.time.elapsed / 1000;

	this.sprite.x = this.position.x;
	this.sprite.y = this.position.y;
	this.sprite.rotation = this.angle;

	//this.face.x = this.position.x;
	//this.face.y = this.position.y;
	
	if (this.moving == 0)
		this.legs.animations.stop();
	else 
		this.legs.animations.play("move");
	

		this.sprite.scale.x = this.direction;

	this.moving = 0;
};


gameObject.prototype.move = function (dir) {
	
	this.moving = 1;
	this.direction = dir.x;
	if (this.direction == 0) this.direction = 1;
	this.position.x += this.speed*dir.x ;
	this.position.y += this.speed*dir.y*1.3  ;
};
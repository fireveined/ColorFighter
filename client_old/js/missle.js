

function missle(position, angle, sprite) {
	var self = this;
	this.position = position;
	this.speed = 14.4;
	this.angle = angle;

	this.sprite = phaser.add.image(position.x, position.y, sprite);
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;

	this.dirx = Math.sin(this.angle) * this.speed;
	this.diry = -Math.cos(this.angle) * this.speed;
}




missle.prototype.update = function () {
	
	this.diry += 0.14;
	this.position.x += this.dirx;
	this.position.y += this.diry;
	

	this.sprite.rotation = this.angle;

	this.sprite.x = this.position.x;
	this.sprite.y = this.position.y;
};


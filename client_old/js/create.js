gameClass.prototype.create = function () {
	
	phaser.add.image(0, 0, "background");
	phaser.physics.startSystem(Phaser.Physics.ARCADE);
	
	this.objects.push(new gameObject(new Phaser.Point(320, 550), 'tank'));
	
	this.keys["up"] = phaser.input.keyboard.addKey(Phaser.Keyboard.W);
	this.keys["down"] = phaser.input.keyboard.addKey(Phaser.Keyboard.S);
	this.keys["left"] = phaser.input.keyboard.addKey(Phaser.Keyboard.A);
	this.keys["right"] = phaser.input.keyboard.addKey(Phaser.Keyboard.D);
	this.keys["space"] = phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	this.hp_bar = new Phaser.Rectangle(0, 550, 800, 50);

	this.hp_bar = phaser.add.image(10, 700-30, 'hp_bar');

};
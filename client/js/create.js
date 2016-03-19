
gameClass.prototype.create = function () {
	

	//phaser.add.image(0, 0, "background");
	
	this.map.create();

		
	setInterval(function () { game.timeLeft--;  }, 1000);
	

	phaser.physics.startSystem(Phaser.Physics.ARCADE);
	
	
	phaser.time.advancedTiming = true;
	

	this.keys["up"] = phaser.input.keyboard.addKey(Phaser.Keyboard.W);
	this.keys["down"] = phaser.input.keyboard.addKey(Phaser.Keyboard.S);
	this.keys["left"] = phaser.input.keyboard.addKey(Phaser.Keyboard.A);
	this.keys["right"] = phaser.input.keyboard.addKey(Phaser.Keyboard.D);
	this.keys["space"] = phaser.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
	
	this.waitText = phaser.add.text(0,0, "GAME STARTS IN ", { fill: "yellow", fontSize: 50, boundsAlignH: "center", boundsAlignV: "middle" });
	this.waitText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
	this.waitText.setTextBounds(0, 0, canvasWidth, canvasHeight);
	this.waitText.visible = false;
};


gameClass.prototype.addPlayer = function (x, y, color, name) {
	
	var a = this.map.objects.length;
	this.map.objects.push(new gameObject(new Phaser.Point(x, y), color));
	this.avatars[a] = [];
	this.avatars[a].avatar = phaser.add.image(hudX , 40 + 80 * a, this.map.objects[a].sprite.generateTexture());
	this.avatars[a].score = phaser.add.text(hudX + 55, 40 + 80 * a + 20, "32", { fill: "yellow" });
	this.avatars[a].name = phaser.add.text(hudX + 15, 40 + 80 * a + 65, name, { fill: "yellow", fontSize: 10 });
	
}


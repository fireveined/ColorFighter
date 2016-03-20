
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
	
	
	this.waitText = phaser.add.text(0,0, "GAME STARTS IN ", { fill: "yellow", fontSize: 45, boundsAlignH: "center", boundsAlignV: "middle" });
	this.waitText.setShadow(5, 5, 'rgba(0,0,0,0.8)', 2);
	this.waitText.setTextBounds(0, 0, canvasWidth-120, canvasHeight);
	this.waitText.visible = false;
	
	this.hallOfFameLabel = phaser.add.text(hudX+17 , 60 + 80 * 4 + 62, "Hall Of Fame", { fill: "yellow", font: "12px Arial" });
	this.hallOfFame =  phaser.add.text(hudX , 60 + 80 * 4 + 80, "Adde", { fill: "yellow", font: "11px Arial" });
	this.hallOfFameWins = phaser.add.text(hudX + 88, 60 + 80 * 4 + 80, "31", { fill: "yellow", font: "11px Arial" });

	this.created = 1;

};


gameClass.prototype.addPlayer = function (x, y, color, name) {
	
	var a = this.map.objects.length;

	this.particles[a] = phaser.add.emitter(0, 0, 100);
	this.particles[a].makeParticles('particle'+a);
	console.log("p" + this.particles[a]);
	this.map.objects.push(new gameObject(new Phaser.Point(x, y), color));
	this.map.objects[a].id = a;
	this.avatars[a] = [];
	this.avatars[a].avatar = phaser.add.image(hudX , 40 + 76 * a, this.map.objects[a].sprite.generateTexture());
	this.avatars[a].score = phaser.add.text(hudX + 55, 40 + 76 * a + 20, "32", { fill: "yellow" , fontSize: 28});
	this.avatars[a].name = phaser.add.text(hudX + 15, 40 + 76 * a + 55, name, { fill: "yellow", fontSize: 14 });
	

}


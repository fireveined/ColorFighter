


gameClass.prototype.update = function () {

	for (var i = 0, l = this.objects.length; i < l; i++) {
		this.objects[i].update();
	}
	
	

	this.manageInput();


	//hud
	this.hp_bar.scale.x = this.objects[0].health[0];
};



gameClass.prototype.manageInput = function () {
	

	if (this.keys["up"].isDown) this.objects[0].move(new Phaser.Point(0, -1));
	if (this.keys["down"].isDown) this.objects[0].move(new Phaser.Point(0, 1));
	if (this.keys["left"].isDown) this.objects[0].move(new Phaser.Point(-1, 0));
	if (this.keys["right"].isDown) this.objects[0].move(new Phaser.Point(1, 0));

	if (this.keys["space"].isDown) this.objects[0].shot(0);
}







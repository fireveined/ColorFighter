function CField(x, y) {
	
	this.posX = x;
	this.posY = y;
	this.field = new sField(x, y);
	this.color = "n";
	
	this.setColor = function (col) {
		this.color = col
		this.sprite.tint = shortToColor(col); }

	this.sprite = game.add.image(x * game.map.fieldSize, y * game.map.fieldSize, "field");
	this.sprite.tint = 0;

	this.setBonus = function (a) {
		if (a != 0 && this.field.bonus != a) {
			if (this.field.bonusSprite != 0)
				this.field.bonusSprite.destroy(1);
			this.field.bonusSprite = phaser.add.image(this.posX * game.map.fieldSize, this.posY * game.map.fieldSize, "bonus", a - 1);
		}
			this.field.bonus = a;

		if (a == 0 && this.field.bonusSprite != 0) {
			this.field.bonusSprite.destroy(1);
			this.field.bonusSprite = 0;
		}
	}

}


CMap.prototype.create = function () {
	
	for (var x = 0; x < this.fieldsX; x++) {
		this.fields[x] = [];
		for (var y = 0; y < this.fieldsY; y++) {
			
			this.fields[x][y] = new CField(x, y);
		}
	}
	
	
	//grid
	for (var x = 0; x < this.fieldsX; x++) {
		var grid = phaser.add.image(x * this.fieldSize, 0, "grid");
		grid.tint = RGBtoHEX(60, 220, 60);
	}
	
	for (var y = 0; y < this.fieldsY; y++) {
		var grid = phaser.add.image(0, y * this.fieldSize + 2, "grid");
		grid.rotation = Math.PI * 1.5;
		grid.tint = RGBtoHEX(60, 220, 60);
	}
}


CMap.prototype.update = function () {

	for (var i = 0, l = this.objects.length; i < l; i++) {
		this.objects[i].update();
	}



	
}




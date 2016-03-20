function CField(x, y) {
	
	this.posX = x;
	this.posY = y;
	this.field = new sField(x, y);
	this.color = "n";
	
	this.setColor = function (col) {
		if (col != this.color && col == "n")
			game.emitParticles(shortToId(this.color), (this.posX + 0.5) * game.map.fieldSize, (this.posY + 0.5) * game.map.fieldSize, shortToColor(this.color), 2);
		this.color = col;
		this.sprite.tint = shortToColor(col); }

	this.sprite = game.add.image(x * game.map.fieldSize, y * game.map.fieldSize, "field");
	this.sprite.tint = 0;
	
	this.setBonus = function (a) {
		if (a != 0 && this.field.bonus != a) {
			if (this.field.bonusSprite != 0)
				this.field.bonusSprite.destroy(1);
			this.field.arrowDir = 0;
			this.field.arrowTimer = 0;
			this.field.bonusSprite = phaser.add.image((this.posX+0.5) * game.map.fieldSize, (this.posY + 0.5) * game.map.fieldSize, "bonus", a - 1);
			this.field.bonusSprite.anchor.x = 0.5;
			this.field.bonusSprite.anchor.y = 0.5;
		}
			this.field.bonus = a;

		if (a == 0 && this.field.bonusSprite != 0) {
			
			game.emitParticles(0, (this.posX + 0.5) * game.map.fieldSize, (this.posY + 0.5) * game.map.fieldSize, RGBtoHEX(0,122,0), 6);

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
	
	for (var i = 0, l = this.objects.length; i < l; i++) {
	//	phaser.world.bringToTop(this.objects[i].sprite);
	}

}


CMap.prototype.update = function () {
	
	for (var i = 0, l = this.objects.length; i < l; i++) {
		this.objects[i].update();
	}
	
	for (var x = 0; x < this.fieldsX; x++)
		for (var y = 0; y < this.fieldsY; y++) {
			if (this.fields[x][y].field.bonus == BONUS_ARROW) {
				this.fields[x][y].field.arrowTimer += game.delta;
				if (this.fields[x][y].field.arrowTimer > _arrowRotationTime) {
					this.fields[x][y].field.arrowTimer = 0;
					this.fields[x][y].field.arrowDir = (this.fields[x][y].field.arrowDir + 1) % 4;
					this.fields[x][y].field.bonusSprite.rotation = this.fields[x][y].field.arrowDir * Math.PI / 2;
				}
			}
		}
	
}






sField = function (x, y) {
	
	this.color="n";
	this.bonus = 0;
	this.bonusSprite = 0;

	this.setColor = function (col) {
		this.color = col;
	}

	this.setBonus = function (a) {
		this.bonus = a;
		this.bonusSprite = 0;
	}

}
var BONUS_SCORE = 1;
CMap = function () {
	
	
	this.fieldSize = 60;
	this.mapWidth = 960;
	this.mapHeight = 660;
	this.fieldsX = this.mapWidth / this.fieldSize;
	this.fieldsY = this.mapHeight / this.fieldSize;
	this.fields = [];
	this.objects = [];

	this.getField = function (x, y) {
		return this.fields[Math.floor(x / this.fieldSize)][Math.floor(y / this.fieldSize)];
	}

	
	this.scoreFields = function (col){
		var count = 0;
		for (var x = 0; x < this.fieldsX; x++) 
			for (var y = 0; y < this.fieldsY; y++) 
				if (this.fields[x][y].color == col) {
					this.fields[x][y].setColor("n");
					count++;
				}
		return count;
	}


	

	this.serverCreate = function () {
		
		for (var x = 0; x < this.fieldsX; x++) {
			this.fields[x] = [];
			for (var y = 0; y < this.fieldsY; y++) {
				
				this.fields[x][y] = new sField(x, y);
			}
		}
	}


	this.reset = function () {
		
		for (var x = 0; x < this.fieldsX; x++)
			for (var y = 0; y < this.fieldsY; y++) {
				this.fields[x][y].setColor("n");
				this.fields[x][y].setBonus(0);
			}
	}

	}
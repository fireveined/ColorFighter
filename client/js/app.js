var playerName;
var playerNameInput = document.getElementById('playerNameInput');
var socket;

function RGBtoHEX(r,g, b) { return r << 16 | g << 8 | b; }

var canvasHeight = 660;
var canvasWidth = 1080;
var hudX = 970;


function shortToColor(s) {
	if (s == "n") return 0;
	if (s == "r") return RGBtoHEX(122, 0, 0);
	if (s == "g") return RGBtoHEX(0, 122, 0);
	if (s == "b") return RGBtoHEX(0, 0, 122);
	if (s == "y") return RGBtoHEX(120, 60, 0);
	if (s == "w") return RGBtoHEX(70, 70, 70);
}



  function gameClass() {
	
	var self = this;
	
	
	
	this.avatars = []
	this.keys = [];
	this.delta = 0;

	this.map = new CMap();
	
	this.numPlayers = 5;
	this.playerId = 0;

	this.getPlayer = function() {
		return this.map.objects[this.playerId];
	}

	this.loaded = 0;

	this.timeLeft = 59;
	this.matchTime = 59;
	this.winner = "";
//this.manageInput = function () { console.log("ff");}
}





gameClass.prototype.preload = function () {

	phaser.load.spritesheet('bonus', 'data/gfx/bonus.png', 60, 60, 2);
	phaser.load.spritesheet('ships', 'data/gfx/ships.png', 60, 60, 5);

	phaser.load.image('field', 'data/gfx/field.png');

	phaser.load.image('grid', 'data/gfx/grid.png');


}





//	var game = new Game();



var game, phaser;


function startGame() {
	

	game = new gameClass();
	phaser = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, 'gameAreaWrapper', game);

  //  playerName = playerNameInput.value.replace(/(<([^>]+)>)/ig, '');
	document.getElementById('startMenuWrapper').style.display = 'none';
	document.getElementById('gameAreaWrapper').style.display = 'block';
	socket = io();
	socket.emit('join', playerNameInput.value);
    SetupSocket(socket);

}

// check if nick is valid alphanumeric characters (and underscores)
function validNick() {
    var regex = /^\w*$/;
    console.log('Regex Test', regex.exec(playerNameInput.value));
    return regex.exec(playerNameInput.value) !== null;
}

window.onload = function() {
    'use strict';

    var btn = document.getElementById('startButton'),
        nickErrorText = document.querySelector('#startMenu .input-error');

    btn.onclick = function () {

        // check if the nick is valid
        if (validNick()) {
            startGame();
        } else {
            nickErrorText.style.display = 'inline';
        }
    };

 
};

function SetupSocket(socket) {
 game.handleNetwork(socket);
}





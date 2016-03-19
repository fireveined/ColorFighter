var playerName;
var playerNameInput = document.getElementById('playerNameInput');
var socket;






  function gameClass() {
	
	var self = this;

	this.objects = [];
	this.keys = [];



//this.manageInput = function () { console.log("ff");}
}





gameClass.prototype.preload = function () {


	phaser.load.spritesheet('legs', 'data/gfx/legs.png', 60, 50, 4);
	phaser.load.spritesheet('body', 'data/gfx/body.png', 60, 40, 4);
	phaser.load.spritesheet('faces', 'data/gfx/faces.png', 60, 50, 4);

	phaser.load.image('fireball', 'data/gfx/fireball.png');

	phaser.load.image('background', 'data/gfx/background.png');

	phaser.load.image('hp_bar', 'data/gfx/hp_bar.png');
}



gameClass.prototype.handleNetwork  = function () {

		
}

//	var game = new Game();






function startGame() {
	


    playerName = playerNameInput.value.replace(/(<([^>]+)>)/ig, '');
	document.getElementById('startMenuWrapper').style.display = 'none';
	document.getElementById('gameAreaWrapper').style.display = 'block';
	socket = io();
	socket.emit('chat message', playerNameInput.value);
    SetupSocket(socket);
	
	/*
	var text = "- phaser -\n with a sprinkle of \n pixi dust.";
	var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
	var t = phaser.add.text(phaser.world.centerX - 300, 0, text, style);
	*/
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





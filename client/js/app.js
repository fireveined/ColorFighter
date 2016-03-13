var playerName;
var playerNameInput = document.getElementById('playerNameInput');
var socket;





//	var game = new Game();
var phaser = new Phaser.Game(800, 600, Phaser.AUTO, 'gameAreaWrapper', { create: create, preload : preload, update: update });


function preload() {
	phaser.load.image('einstein', 'data/gfx/test.png');
}


function startGame() {
	


    playerName = playerNameInput.value.replace(/(<([^>]+)>)/ig, '');
	document.getElementById('startMenuWrapper').style.display = 'none';
	document.getElementById('gameAreaWrapper').style.display = 'block';
	socket = io();
	socket.emit('chat message', playerNameInput.value);
    SetupSocket(socket);

	var text = "- phaser -\n with a sprinkle of \n pixi dust.";
	var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
	
	var t = phaser.add.text(phaser.world.centerX - 300, 0, text, style);

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

    playerNameInput.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;

        if (key === KEY_ENTER) {
            if (validNick()) {
                startGame();
            } else {
                nickErrorText.style.display = 'inline';
            }
        }
    });
};

function SetupSocket(socket) {
 // game.handleNetwork(socket);
}





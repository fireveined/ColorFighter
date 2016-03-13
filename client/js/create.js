

function create() {


	var image = phaser.add.sprite(0, 0, 'einstein');
	phaser.physics.enable(image, Phaser.Physics.ARCADE);
	

	image.x = 32;
}
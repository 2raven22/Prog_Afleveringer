import Phaser from "phaser";

class DungeonScene extends Phaser.Scene {
    constructor() {
        super("DungeonScene");
    }

    preload() {
        this.load.image("tiles", "assets/tiles.png"); // Replace with actual tileset
        this.load.tilemapTiledJSON("map", "assets/dungeon.json");
        this.load.spritesheet("player1", "assets/player1.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("player2", "assets/player2.png", { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        // Load Tilemap
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("tiles");
        const layer = map.createLayer("Ground", tileset);
        layer.setCollisionByProperty({ collides: true });

        // Create Players
        this.players = {
            player1: this.physics.add.sprite(100, 100, "player1"),
            player2: this.physics.add.sprite(200, 100, "player2"),
        };
        
        // Player Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: "W", left: "A", down: "S", right: "D"
        });
    }

    update() {
        this.handleMovement(this.players.player1, this.wasd);
        this.handleMovement(this.players.player2, this.cursors);
    }

    handleMovement(player, controls) {
        const speed = 100;
        player.setVelocity(0);
        if (controls.left.isDown) player.setVelocityX(-speed);
        else if (controls.right.isDown) player.setVelocityX(speed);
        if (controls.up.isDown) player.setVelocityY(-speed);
        else if (controls.down.isDown) player.setVelocityY(speed);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: { default: "arcade", arcade: { gravity: { y: 0 }, debug: false } },
    scene: DungeonScene,
};

const game = new Phaser.Game(config);

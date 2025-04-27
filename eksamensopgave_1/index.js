// Klasse, der repræsenterer en spiller
class Player {
    constructor(x, y, imgSrc, controls) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.controls = controls;
        this.bullets = [];
        this.lives = 3; 
        this.hitCooldown = 0;
        this.isDead = false

        this.image = new Image();
        this.image.src = imgSrc;
    }

    draw(ctx) {
        if (this.isDead) return;

        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.bullets.forEach(b => b.draw(ctx));
    }

    move(keys) {
        if (this.isDead) return;

        const speed = 3;
        if (keys[this.controls.up] && this.y - speed >= 0) {
            this.y -= speed;
            this.facingDirection = "up";
        }
        if (keys[this.controls.down] && this.y + this.height + speed <= canvas.height) {
            this.y += speed;
            this.facingDirection = "down";
        }
        if (keys[this.controls.left] && this.x - speed >= 0) {
            this.x -= speed;
            this.facingDirection = "left";
        }
        if (keys[this.controls.right] && this.x + this.width + speed <= canvas.width) {
            this.x += speed;
            this.facingDirection = "right";
        }
    }

    loseLife() {
        if (this.hitCooldown === 0 && !this.isDead) {
            this.lives--;
            this.hitCooldown = 60; // 60 frames cooldown (kan justeres)
            if (this.lives <= 0) {
                // Spilleren er død, håndter spillets afslutning her
                this.isDead = true; // Sæt spilleren som død
                return true;  // Angiver at spilleren er død
            }
        }
        return false;
    }

    // Opdaterer cooldown for at kunne tage et nyt hit
    updateCooldown() {
        if (this.hitCooldown > 0) {
            this.hitCooldown--;
        }
    }


   shoot(){
        let dx = 0;
        let dy = 0;
        
        switch (this.facingDirection) {
            case "up": dy = -5; break;
            case "down": dy = 5; break;
            case "left": dx = -5; break;
            case "right": dx = 5; break;
        }
        
        this.bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, dx, dy, this.color));
    }
    updateBullets() {
        this.bullets.forEach(b => b.update());
        this.bullets = this.bullets.filter(b =>
            b.x > 0 && b.x < canvas.width && b.y > 0 && b.y < canvas.height);
    } 
}

// Klasse, der repræsenterer en kugle
class Bullet {
    constructor(x, y, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = "blue" ;
        this.width = 4;
        this.height = 10;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


// Klasse, der repræsenterer en fjende
class Enemy {
    constructor(x, y, color, speed) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = 20;
        this.height = 20;
        this.speed = speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(player1, player2) {
        // Beregn afstanden til begge spillere
        let dx1 = player1.x - this.x;
        let dy1 = player1.y - this.y;
        let distance1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

        let dx2 = player2.x - this.x;
        let dy2 = player2.y - this.y;
        let distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        // Hvis spiller 1 er tættere, følg spiller 1, ellers følg spiller 2
        let targetPlayer = distance1 < distance2 ? player1 : player2;

        // Beregn forskellen i position og normaliser vektoren
        let dx = targetPlayer.x - this.x;
        let dy = targetPlayer.y - this.y;

        let distance = Math.sqrt(dx * dx + dy * dy);

        dx /= distance;
        dy /= distance;

        // Bevæger fjenden i retningen af den tætteste spiller
        this.x += dx * this.speed;
        this.y += dy * this.speed;

    // Tjek for kollision med spilleren
    if (isColliding(this, player1)) {
        if (player1.loseLife()) {
        // Hvis spiller1 dør
        alert("Spiller 1 er død!");
    }
}

if (isColliding(this, player2)) {
    if (player2.loseLife()) {
        // Hvis spiller2 dør
        alert("Spiller 2 er død!");
            }
        }
    }
}

// Henter canvas-elementet og opsætter tegnekonteksten
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let keys = {};
let score = 0;

document.addEventListener("keydown", e => {
    keys[e.key] = true; // Retter fra e.keys til e.key
    if (e.key === ' ') player1.shoot();
    if (e.key === 'Enter') player2.shoot();
});
document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

// Opretter to spillere
const player1 = new Player(100, 350, "assets/ak.png", {
    up: "w", down: "s", left: "a", right: "d"
}, );

const player2 = new Player(400, 350, "assets/ak.png", {
    up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight"
});

// Fjende spawner
const enemies = [];

function spawnEnemy() {
    // Vælger en tilfældig position for spawn udenfor canvaset
    const spawnSide = Math.random() < 0.5 ? 'left' : 'right'; // Vælger om fjenden spawn'er til venstre eller højre
    const spawnY = Math.random() * canvas.height; // Tilfældigt Y-position på canvaset
    let spawnX;

    // Spawner på venstre eller højre side af canvas
    if (spawnSide === 'left') {
        spawnX = -20; // Starter lige udenfor venstre kant
    } else {
        spawnX = canvas.width + 20; // Starter lige udenfor højre kant
    }

    const enemy = new Enemy(spawnX, spawnY, "red", 1); // Opretter en ny fjende
    enemies.push(enemy); // Lægger fjenden til i enemies array
}

let spawnInterval = 4000; // Startinterval
let minimumInterval = 1000;
let intervalReducer = 250;

let enemySpeed = 1; // Start-hastighed

function spawnEnemy() {
    const spawnSide = Math.random() < 0.5 ? 'left' : 'right';
    const spawnY = Math.random() * canvas.height;
    let spawnX = spawnSide === 'left' ? -20 : canvas.width + 20;

    const enemy = new Enemy(spawnX, spawnY, "red", enemySpeed); // Brug den aktuelle hastighed
    enemies.push(enemy);
}

function startEnemySpawner() {
    setTimeout(function spawn() {
        spawnEnemy();

        // Reducer interval, men ikke under minimum
        spawnInterval = Math.max(minimumInterval, spawnInterval - intervalReducer);

        setTimeout(spawn, spawnInterval);
    }, spawnInterval);
}

function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}


// Game loop funktion, der kører hver frame
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Rydder canvaset

    // Hvis begge spillere er døde, afslut spillet
    if (player1.lives <= 0 && player2.lives <= 0) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
        return; // Stopper spillet
    }

    ctx.fillStyle = "white"
    ctx.fillText("Score: " + score, 600, 20);

    // Tegner spillere og opdaterer deres tilstand
    [player1, player2].forEach(p => {
        p.move(keys);
        p.updateBullets();
        p.draw(ctx);
        p.updateCooldown(); // Opdaterer cooldown for spilleren
    });

    // Tegn livene på et fast sted for begge spillere
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Player 1 Lives: " + player1.lives, 30, 30);
    ctx.fillText("Player 2 Lives: " + player2.lives, canvas.width - 180, 30);

    // Opdaterer og tegner alle fjender
    enemies.forEach(enemy => {
        enemy.update(player1, player2); // Fjenden følger den tætteste spiller
        enemy.draw(ctx); // Tegner fjenden
    });

    // Tjek for kollisioner mellem kugler og fjender
    enemies.forEach((enemy, enemyIndex) => {
        [player1, player2].forEach(player => {
            player.bullets.forEach((bullet, bulletIndex) => {
                const bulletRect = {
                    x: bullet.x,
                    y: bullet.y,
                    width: 4,
                    height: 10
                };

                const enemyRect = {
                    x: enemy.x,
                    y: enemy.y,
                    width: enemy.width,
                    height: enemy.height
                };

                if (isColliding(bulletRect, enemyRect)) {
                    // Fjern fjende og kugle
                    enemies.splice(enemyIndex, 1);
                    player.bullets.splice(bulletIndex, 1);
                    score += 15; 
                }
            });
        });
    });

    requestAnimationFrame(gameLoop); // Kører game loop igen
}

// Start game loop'en og spawner fjender
player1.image.onload = () => {
    player2.image.onload = () => {
        gameLoop(); // Starter game loop'en
        startEnemySpawner(); //starter enemy spawners tid
    };
};
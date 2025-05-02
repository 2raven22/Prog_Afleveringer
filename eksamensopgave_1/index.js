// Klasse, der repræsenterer en spiller
class Player {
    constructor(x, y, imgSrc, controls) {
        this.x = x; // Spillerens x-position
        this.y = y; // Spillerens y-position
        this.width = 40; // Bredde på spilleren
        this.height = 40; // Højde på spilleren
        this.controls = controls; // Hvilke taster spilleren bruger
        this.bullets = []; // Liste over skud affyret af spilleren
        this.lives = 3; // Start-liv
        this.hitCooldown = 0; // Tidsperiode hvor spilleren ikke kan tage skade igen
        this.isDead = false; // Om spilleren er død

        this.image = new Image(); // Opretter billede
        this.image.src = imgSrc; // Indlæser billede fra fil
    }

    // Tegner spilleren og deres skud
    draw(ctx) {
        if (this.isDead) return; // Tegner ikke hvis spilleren er død
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); // Tegner spillerens billede
        this.bullets.forEach(b => b.draw(ctx)); // Tegner alle spillerens skud
    }

    // Behandler bevægelse baseret på tastetryk
    move(keys) {
        if (this.isDead) return; // Døde spillere bevæger sig ikke
        const speed = 3; // Hastighed

        // Flytter op/ned/venstre/højre afhængigt af tast
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

    // Spilleren mister et liv
    loseLife() {
        if (this.hitCooldown === 0 && !this.isDead) {
            this.lives--;
            this.hitCooldown = 60; // Sætter en cooldown på 60 frames
            if (this.lives <= 0) {
                this.isDead = true; // Spilleren er nu død
                return true;
            }
        }
        return false;
    }

    // Opdaterer cooldown, så spilleren igen kan tage skade
    updateCooldown() {
        if (this.hitCooldown > 0) {
            this.hitCooldown--;
        }
    }

    // Spilleren skyder et skud
    shoot() {
        let dx = 0;
        let dy = 0;

        // Bestem retningen kuglen skal flyve i
        switch (this.facingDirection) {
            case "up": dy = -5; break;
            case "down": dy = 5; break;
            case "left": dx = -5; break;
            case "right": dx = 5; break;
        }

        // Tilføj kuglen til listen af bullets
        this.bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, dx, dy, this.color));
    }

    // Opdaterer kuglerne (bevægelse og fjerner dem hvis de er udenfor skærmen)
    updateBullets() {
        this.bullets.forEach(b => b.update());
        this.bullets = this.bullets.filter(b =>
            b.x > 0 && b.x < canvas.width && b.y > 0 && b.y < canvas.height);
    }
}

// Klasse til kugler, som spillerne skyder
class Bullet {
    constructor(x, y, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.dx = dx; // X-retning
        this.dy = dy; // Y-retning
        this.color = "blue"; // Kuglens farve
        this.width = 4;
        this.height = 10;
    }

    // Opdaterer position
    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    // Tegner kuglen
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Klasse til fjender
class Enemy {
    constructor(x, y, color, speed) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = 20;
        this.height = 20;
        this.speed = speed; // Hvor hurtigt fjenden bevæger sig
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Fjenden jagter nærmeste spiller
    update(player1, player2) {
        const alivePlayers = [player1, player2].filter(p => !p.isDead); // Kun levende spillere

        if (alivePlayers.length === 0) return; // Stop hvis ingen spillere er i live

        // Find nærmeste spiller
        let closestPlayer = alivePlayers[0];
        let closestDistance = this.getDistanceTo(closestPlayer);
        for (let i = 1; i < alivePlayers.length; i++) {
            const distance = this.getDistanceTo(alivePlayers[i]);
            if (distance < closestDistance) {
                closestPlayer = alivePlayers[i];
                closestDistance = distance;
            }
        }

        // Bevæg dig mod spilleren
        let dx = closestPlayer.x - this.x;
        let dy = closestPlayer.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        dx /= distance;
        dy /= distance;

        this.x += dx * this.speed;
        this.y += dy * this.speed;

        // Hvis fjenden rammer en spiller
        if (!player1.isDead && isColliding(this, player1)) {
            player1.loseLife();
        }
        if (!player2.isDead && isColliding(this, player2)) {
            player2.loseLife();
        }
    }

    // Beregner afstanden til en spiller
    getDistanceTo(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

// Henter canvas og sætter op
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let keys = {}; // Taster der bliver holdt nede
let score = 0; // Spillets score

// Registrerer tastetryk
document.addEventListener("keydown", e => {
    keys[e.key] = true;
    if (e.key === ' ') player1.shoot(); // Player1 skyder med mellemrum
    if (e.key === 'Enter') player2.shoot(); // Player2 skyder med enter
});
document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

// Opretter to spillere
const player1 = new Player(100, 350, "assets/ak.png", {
    up: "w", down: "s", left: "a", right: "d"
});

const player2 = new Player(400, 350, "assets/ak.png", {
    up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight"
});

// Fjenderne bliver gemt i denne liste
const enemies = [];

// Funktion til at tjekke for kollision
function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

let playerName = ""; // Gemmer spillerens navn

// Starter spillet
function startGame() {
    const input = document.getElementById("playerName");
    playerName = input.value || "Spiller 1";

    document.getElementById("startScreen").style.display = "none";
    canvas.style.display = "block";

    // Starter først spillet når billeder er klar
    player1.image.onload = () => {
        player2.image.onload = () => {
            gameLoop();
            startEnemySpawner();
        };
    };
}

// Spawner fjender løbende
let spawnInterval = 4000;
let minimumInterval = 1000;
let intervalReducer = 250;
let enemySpeed = 1;

function spawnEnemy() {
    const spawnSide = Math.random() < 0.5 ? 'left' : 'right';
    const spawnY = Math.random() * canvas.height;
    let spawnX = spawnSide === 'left' ? -20 : canvas.width + 20;

    const enemy = new Enemy(spawnX, spawnY, "red", enemySpeed);
    enemies.push(enemy);
}

function startEnemySpawner() {
    setTimeout(function spawn() {
        spawnEnemy();
        spawnInterval = Math.max(minimumInterval, spawnInterval - intervalReducer);
        setTimeout(spawn, spawnInterval);
    }, spawnInterval);
}

// Selve spil-loopet, som kører hvert frame
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Rydder skærmen

    // Hvis begge spillere er døde
    if (player1.lives <= 0 && player2.lives <= 0) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2 - 20);
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Samlet score: " + score, canvas.width / 2 - 100, canvas.height / 2 + 30);
        return;
    }

    // Viser scoren
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 600, 20);

    // Opdater og tegn spillere
    [player1, player2].forEach(p => {
        p.move(keys);
        p.updateBullets();
        p.draw(ctx);
        p.updateCooldown();
    });

    // Viser liv tilbage
    ctx.font = "20px Arial";
    ctx.fillText("Player 1 Lives: " + player1.lives, 30, 30);
    ctx.fillText("Player 2 Lives: " + player2.lives, canvas.width - 180, 30);

    // Opdater og tegn fjender
    enemies.forEach(enemy => {
        enemy.update(player1, player2);
        enemy.draw(ctx);
    });

    // Tjek om skud rammer fjender
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
                    enemies.splice(enemyIndex, 1);
                    player.bullets.splice(bulletIndex, 1);
                    score += 15;
                }
            });
        });
    });

    requestAnimationFrame(gameLoop); // Kalder sig selv igen
}

// Klasse, der repræsenterer en spiller
class Player {
    constructor(x, y, color, controls) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = 20;
        this.height = 20;
        this.controls = controls;
        this.bullets = [];
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.bullets.forEach(b => b.draw(ctx));
    }

    move(keys) {
        if (keys[this.controls.up]) this.y -= 3;
        if (keys[this.controls.down]) this.y += 3;
        if (keys[this.controls.left]) this.x -= 3;
        if (keys[this.controls.right]) this.x += 3;
    }

    shoot() {
        this.bullets.push(new Bullet(this.x + 10, this.y - 5, -5, this.color));
    }

    updateBullets() {
        this.bullets.forEach(b => b.update());
        this.bullets = this.bullets.filter(b => b.y > 0);
    }
}

// Klasse, der repræsenterer en kugle
class Bullet {
    constructor(x, y, speed, color) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.color = color;
    }

    update() {
        this.y += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 4, 10);
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
    }
}

// Henter canvas-elementet og opsætter tegnekonteksten
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let keys = {};

document.addEventListener("keydown", e => {
    keys[e.key] = true; // Retter fra e.keys til e.key
    if (e.key === ' ') player1.shoot();
    if (e.key === 'Enter') player2.shoot();
});
document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

// Opretter to spillere
const player1 = new Player(100, 350, "blue", {
    up: "w", down: "s", left: "a", right: "d"
});

const player2 = new Player(400, 350, "green", {
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

// Spawn en fjende hver 4. sekund (langsommere end før)
setInterval(spawnEnemy, 4000);

// Game loop funktion, der kører hver frame
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Rydder canvaset

    // Opdaterer og tegner spillere
    [player1, player2].forEach(p => {
        p.move(keys);
        p.updateBullets();
        p.draw(ctx);
    });

    // Opdaterer og tegner alle fjender
    enemies.forEach(enemy => {
        enemy.update(player1, player2); // Fjenden følger den tætteste spiller
        enemy.draw(ctx); // Tegner fjenden
    });

    requestAnimationFrame(gameLoop); // Kører game loop igen
}

gameLoop(); // Starter game loop'en

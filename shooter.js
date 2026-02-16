const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const overlay = document.getElementById("overlay");
const overlayText = document.getElementById("overlayText");
const statusEl = document.getElementById("status");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const waveEl = document.getElementById("wave");
const shootBtn = document.getElementById("shootBtn");

const keys = new Set();
const stars = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.4,
    speed: Math.random() * 20 + 15,
}));

const player = {
    x: canvas.width / 2 - 18,
    y: canvas.height - 60,
    w: 36,
    h: 36,
    speed: 260,
};

let bullets = [];
let enemies = [];
let lastTime = 0;

const state = {
    running: false,
    paused: false,
    score: 0,
    lives: 3,
    wave: 1,
    lastShot: 0,
    elapsed: 0,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getDifficultyMultiplier = () => {
    const rampSeconds = 80;
    const maxBoost = 1.8;
    const progress = Math.min(state.elapsed / rampSeconds, 1);
    return 1 + progress * maxBoost;
};

const updateHud = () => {
    scoreEl.textContent = state.score;
    livesEl.textContent = state.lives;
    waveEl.textContent = state.wave;
};

const setOverlay = (message, visible) => {
    overlayText.textContent = message;
    overlay.classList.toggle("hidden", !visible);
};

const resetGame = () => {
    state.score = 0;
    state.lives = 3;
    state.wave = 1;
    state.lastShot = 0;
    state.elapsed = 0;
    bullets = [];
    enemies = [];
    player.x = canvas.width / 2 - player.w / 2;
    player.y = canvas.height - 60;
    updateHud();
    statusEl.textContent = "Waiting for launch...";
};

const spawnWave = () => {
    const count = 5 + state.wave * 2;
    const speedBase = 45 + state.wave * 8;
    for (let i = 0; i < count; i += 1) {
        const size = 26 + Math.random() * 14;
        enemies.push({
            x: Math.random() * (canvas.width - size),
            y: -Math.random() * 360 - size,
            w: size,
            h: size,
            speed: speedBase + Math.random() * 25,
        });
    }
};

const shoot = (timestamp) => {
    if (timestamp - state.lastShot < 260) return;
    bullets.push({
        x: player.x + player.w / 2 - 3,
        y: player.y - 12,
        w: 6,
        h: 12,
        speed: 420,
    });
    state.lastShot = timestamp;
};

const hitTest = (a, b) =>
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;

const handleGameOver = () => {
    state.running = false;
    state.paused = false;
    statusEl.textContent = "Game over. Reset to try again.";
    setOverlay("Mission failed. Press Reset.", true);
    startBtn.textContent = "Start";
};

const update = (delta, timestamp) => {
    state.elapsed += delta;
    const difficultyMultiplier = getDifficultyMultiplier();
    if (keys.has("arrowleft") || keys.has("a")) {
        player.x -= player.speed * delta;
    }
    if (keys.has("arrowright") || keys.has("d")) {
        player.x += player.speed * delta;
    }
    player.x = clamp(player.x, 12, canvas.width - player.w - 12);

    if (keys.has("space")) {
        shoot(timestamp);
    }

    bullets = bullets
        .map((bullet) => ({ ...bullet, y: bullet.y - bullet.speed * delta }))
        .filter((bullet) => bullet.y + bullet.h > 0);

    enemies.forEach((enemy) => {
        enemy.y += enemy.speed * difficultyMultiplier * delta;
    });

    enemies = enemies.filter((enemy) => enemy.y < canvas.height + 40);

    for (let i = enemies.length - 1; i >= 0; i -= 1) {
        const enemy = enemies[i];
        for (let j = bullets.length - 1; j >= 0; j -= 1) {
            const bullet = bullets[j];
            if (hitTest(enemy, bullet)) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                state.score += 10;
                updateHud();
                break;
            }
        }
    }

    for (let i = enemies.length - 1; i >= 0; i -= 1) {
        const enemy = enemies[i];
        if (hitTest(enemy, player)) {
            enemies.splice(i, 1);
            state.lives -= 1;
            updateHud();
            if (state.lives <= 0) {
                handleGameOver();
                return;
            }
        }
    }

    const missed = enemies.filter((enemy) => enemy.y + enemy.h >= canvas.height);
    if (missed.length > 0) {
        enemies = enemies.filter((enemy) => enemy.y + enemy.h < canvas.height);
        state.lives -= missed.length;
        updateHud();
        if (state.lives <= 0) {
            handleGameOver();
            return;
        }
    }

    if (enemies.length === 0) {
        state.wave += 1;
        updateHud();
        statusEl.textContent = `Wave ${state.wave} incoming!`;
        spawnWave();
    }
};

const drawPlayer = () => {
    ctx.fillStyle = "#34d399";
    ctx.beginPath();
    ctx.moveTo(player.x + player.w / 2, player.y);
    ctx.lineTo(player.x, player.y + player.h);
    ctx.lineTo(player.x + player.w, player.y + player.h);
    ctx.closePath();
    ctx.fill();
};

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
        ctx.fillStyle = "rgba(236, 254, 255, 0.7)";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
    });

    bullets.forEach((bullet) => {
        ctx.fillStyle = "#fde047";
        ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
    });

    enemies.forEach((enemy) => {
        ctx.fillStyle = "#f43f5e";
        ctx.beginPath();
        ctx.arc(
            enemy.x + enemy.w / 2,
            enemy.y + enemy.h / 2,
            enemy.w / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });

    drawPlayer();
};

const updateStars = (delta) => {
    stars.forEach((star) => {
        star.y += star.speed * delta;
        if (star.y > canvas.height) {
            star.y = -star.r * 4;
            star.x = Math.random() * canvas.width;
        }
    });
};

const loop = (timestamp) => {
    const delta = (timestamp - lastTime) / 1000 || 0;
    lastTime = timestamp;

    if (state.running && !state.paused) {
        update(delta, timestamp);
    }

    updateStars(delta);
    draw();
    requestAnimationFrame(loop);
};

const startGame = () => {
    if (!state.running) {
        resetGame();
        state.running = true;
        spawnWave();
    }
    state.paused = false;
    setOverlay("", false);
    statusEl.textContent = "In flight...";
    startBtn.textContent = "Resume";
};

const togglePause = () => {
    if (!state.running) return;
    state.paused = !state.paused;
    if (state.paused) {
        setOverlay("Paused", true);
        statusEl.textContent = "Paused.";
        startBtn.textContent = "Resume";
    } else {
        setOverlay("", false);
        statusEl.textContent = "Back in action.";
    }
};

startBtn.addEventListener("click", () => {
    if (state.paused || !state.running) {
        startGame();
    }
});

resetBtn.addEventListener("click", () => {
    state.running = false;
    state.paused = false;
    resetGame();
    setOverlay("Press Start to play", true);
    startBtn.textContent = "Start";
});

window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (["arrowleft", "arrowright", "a", "d"].includes(key)) {
        keys.add(key);
    }
    if (event.code === "Space") {
        event.preventDefault();
        keys.add("space");
        if (!state.running) {
            startGame();
        }
    }
    if (key === "p") {
        togglePause();
    }
});

window.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    keys.delete(key);
    if (event.code === "Space") {
        keys.delete("space");
    }
});

const bindHoldButton = (button, key) => {
    if (!button) return;
    const startHold = (event) => {
        event.preventDefault();
        keys.add(key);
        if (!state.running) {
            startGame();
        }
    };
    const endHold = (event) => {
        event.preventDefault();
        keys.delete(key);
    };
    button.addEventListener("pointerdown", startHold);
    button.addEventListener("pointerup", endHold);
    button.addEventListener("pointerleave", endHold);
    button.addEventListener("pointercancel", endHold);
};

bindHoldButton(shootBtn, "space");

const pointerState = {
    active: false,
    id: null,
};

const movePlayerToPointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const scaleX = canvas.width / rect.width;
    const target = x * scaleX - player.w / 2;
    player.x = clamp(target, 12, canvas.width - player.w - 12);
};

canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    pointerState.active = true;
    pointerState.id = event.pointerId;
    canvas.setPointerCapture(event.pointerId);
    movePlayerToPointer(event);
    if (!state.running) {
        startGame();
    }
});

canvas.addEventListener("pointermove", (event) => {
    if (!pointerState.active || event.pointerId !== pointerState.id) return;
    movePlayerToPointer(event);
});

const stopPointer = (event) => {
    if (event.pointerId !== pointerState.id) return;
    pointerState.active = false;
    pointerState.id = null;
};

canvas.addEventListener("pointerup", stopPointer);
canvas.addEventListener("pointercancel", stopPointer);

resetGame();
setOverlay("Press Start to play", true);
requestAnimationFrame(loop);

/* 
   STUDENT: JavaScript is the "Brain" of our game. 
   It handles all the math, moves the ball, and decides the rules.
*/

// --- 1. SETTING UP THE CHALKBOARD ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// STUDENT: We now have a "Resize" function to make sure the game fills the screen!
// STUDENT: Improved resize for better landscape/mobile support
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Fix for some mobile browsers where innerHeight isn't updated immediately
    if (window.visualViewport) {
        canvas.width = window.visualViewport.width;
        canvas.height = window.visualViewport.height;
    }

    player.x = 20;
    ai.x = canvas.width - paddleWidth - 20;

    // Ensure paddles are still centered in their tracks
    player.y = Math.min(player.y, canvas.height - paddleHeight);
    ai.y = Math.min(ai.y, canvas.height - paddleHeight);
}

// Listen for both resize and orientation change
window.addEventListener('resize', () => setTimeout(resize, 100));
window.addEventListener('orientationchange', () => setTimeout(resize, 200));

// --- 2. GAME VARIABLES (Things that change) ---
let gameRunning = false;
let ballMoving = false;
let currentDifficulty = 'NORMAL';

// STUDENT: Speeds are now "Pixels per Second" instead of "Pixels per Frame".
// This makes the game run the same speed on iPads and fast PCs!
const difficulties = {
    'EASY': { ballSpeed: 350, aiSpeed: 300, errorPercent: 50 },
    'NORMAL': { ballSpeed: 450, aiSpeed: 400, errorPercent: 25 },
    'HARD': { ballSpeed: 700, aiSpeed: 600, errorPercent: 10 },
    'EXPERT': { ballSpeed: 900, aiSpeed: 900, errorPercent: 0 }
};

let ball = {
    x: 0,
    y: 0,
    radius: 10,
    speedX: 0,
    speedY: 0,
    color: '#ffffff'
};

const paddleWidth = 15;
const paddleHeight = 100;

let player = { x: 20, y: 0, score: 0 };
let ai = { x: 0, y: 0, score: 0 };

// Initial setup
resize();
player.y = canvas.height / 2 - paddleHeight / 2;
ai.y = canvas.height / 2 - paddleHeight / 2;

// ... (drawRect, drawCircle stay same) ...

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, '#004411');

    for (let i = 0; i < canvas.height; i += 40) {
        drawRect(canvas.width / 2 - 1, i, 2, 20, '#00ff66');
    }

    drawRect(player.x, player.y, paddleWidth, paddleHeight, '#00ff66');
    drawRect(ai.x, ai.y, paddleWidth, paddleHeight, '#ff0066');
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// --- 4. MOVEMENT LOGIC (The Physics) ---

function resetBall() {
    const diff = difficulties[currentDifficulty];
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    ballMoving = false;
    ball.speedX = 0;
    ball.speedY = 0;

    setTimeout(() => {
        if (gameRunning) {
            ball.speedX = (Math.random() > 0.5) ? -diff.ballSpeed : diff.ballSpeed;
            ball.speedY = diff.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
            ballMoving = true;
        }
    }, 1000);
}

function collision(b, p) {
    return b.x + b.radius > p.x &&
        b.x - b.radius < p.x + paddleWidth &&
        b.y + b.radius > p.y &&
        b.y - b.radius < p.y + paddleHeight;
}

// STUDENT: The "update" function now takes "dt" (Delta Time).
// Delta Time is the time in SECONDS since the last frame.
function update(dt) {
    if (!gameRunning) return;

    // Movement = Speed * Time
    ball.x += ball.speedX * dt;
    ball.y += ball.speedY * dt;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
    }

    let aiSpeed = difficulties[currentDifficulty].aiSpeed;
    let aiPaddleCenter = ai.y + paddleHeight / 2;

    if (aiPaddleCenter < ball.y - 10) {
        ai.y += aiSpeed * dt;
    } else if (aiPaddleCenter > ball.y + 10) {
        ai.y -= aiSpeed * dt;
    }

    let playerOrAi = (ball.speedX < 0) ? player : ai;

    if (collision(ball, playerOrAi)) {
        ball.speedX = -ball.speedX;
        ball.speedX *= 1.1;
    }

    if (ball.x - ball.radius < 0) {
        ai.score++;
        document.getElementById('ai-score').innerText = ai.score;
        checkWin();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        document.getElementById('player-score').innerText = player.score;
        checkWin();
    }
}

// ... (checkWin, startGame stay mostly same) ...

function startGame(difficulty) {
    currentDifficulty = difficulty;
    player.score = 0;
    ai.score = 0;
    document.getElementById('player-score').innerText = 0;
    document.getElementById('ai-score').innerText = 0;

    player.y = canvas.height / 2 - paddleHeight / 2;
    ai.y = canvas.height / 2 - paddleHeight / 2;

    gameRunning = true;
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');

    resetBall();
}

function checkWin() {
    if (player.score >= 10 || ai.score >= 10) {
        gameRunning = false;
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('winner-text').innerText =
            player.score >= 10 ? "PLAYER WINS!" : "COMPUTER WINS!";
    } else {
        resetBall();
    }
}

// --- 6. EVENT LISTENERS ---

canvas.addEventListener('mousemove', (event) => {
    if (!gameRunning) return;
    let rect = canvas.getBoundingClientRect();
    let mouseY = event.clientY - rect.top;

    // Scale mouseY based on internal canvas resolution vs screen size
    let scaleY = canvas.height / rect.height;
    player.y = (mouseY * scaleY) - paddleHeight / 2;
});

canvas.addEventListener('touchmove', (event) => {
    if (!gameRunning) return;
    event.preventDefault(); // Stop the page from moving!
    let rect = canvas.getBoundingClientRect();
    let touch = event.touches[0];

    let scaleY = canvas.height / rect.height;
    let mouseY = (touch.clientY - rect.top) * scaleY;
    player.y = mouseY - paddleHeight / 2;
}, { passive: false });

// STUDENT: We also add start/end listeners to be extra sure the iPad doesn't scroll!
canvas.addEventListener('touchstart', (event) => {
    if (event.target === canvas) event.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', (event) => {
    if (event.target === canvas) event.preventDefault();
}, { passive: false });

document.getElementById('btn-easy').addEventListener('click', () => startGame('EASY'));
document.getElementById('btn-normal').addEventListener('click', () => startGame('NORMAL'));
document.getElementById('btn-hard').addEventListener('click', () => startGame('HARD'));
document.getElementById('btn-expert').addEventListener('click', () => startGame('EXPERT'));
document.getElementById('btn-restart').addEventListener('click', () => startGame(currentDifficulty));
document.getElementById('btn-main-menu').addEventListener('click', () => {
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.remove('hidden');
});

// --- 7. THE GAME LOOP ---
let lastTime = 0;

function gameLoop(currentTime) {
    // Calculate how much time passed since the last frame
    let dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Safety check: if dt is too big (like if you tab out), reset it
    if (dt > 0.1) dt = 0.016;

    update(dt);
    draw();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

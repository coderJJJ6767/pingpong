/* 
   STUDENT: JavaScript is the "Brain" of our game. 
   It handles all the math, moves the ball, and decides the rules.
*/

// --- 1. SETTING UP THE CHALKBOARD ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d'); // STUDENT: "ctx" is like the pencil we use to draw on the canvas.

// STUDENT: We set the size of our game board.
canvas.width = 800;
canvas.height = 400;

// --- 2. GAME VARIABLES (Things that change) ---
let gameRunning = false;
let ballMoving = false; // STUDENT: A new switch to control if the ball is actually moving or "Waiting"
let currentDifficulty = 'NORMAL';

// STUDENT: These values come from our Implementation Plan!
const difficulties = {
    'EASY': { ballSpeed: 5, aiSpeed: 3, errorPercent: 50 },
    'NORMAL': { ballSpeed: 7, aiSpeed: 5, errorPercent: 25 },
    'HARD': { ballSpeed: 10, aiSpeed: 8, errorPercent: 10 },
    'EXPERT': { ballSpeed: 12, aiSpeed: 12, errorPercent: 0 }
};

// The Ball Object
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 5,
    color: '#ffffff'
};

// The Paddles
const paddleWidth = 10;
const paddleHeight = 80;

let player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    score: 0
};

let ai = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    score: 0
};

// --- 3. DRAWING FUNCTIONS (The Artist) ---

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function draw() {
    // STUDENT: Step 1 - Clear the board so it's fresh for the next frame.
    // If we skip this, the ball will look like a long snake!
    drawRect(0, 0, canvas.width, canvas.height, '#004411');

    // STUDENT: Step 2 - Draw the Net (The line in the middle)
    for (let i = 0; i < canvas.height; i += 40) {
        drawRect(canvas.width / 2 - 1, i, 2, 20, '#00ff66');
    }

    // STUDENT: Step 3 - Draw the paddles and ball
    drawRect(player.x, player.y, paddleWidth, paddleHeight, '#00ff66');
    drawRect(ai.x, ai.y, paddleWidth, paddleHeight, '#ff0066'); // AI is neon pink!
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// --- 4. MOVEMENT LOGIC (The Physics) ---

// STUDENT: This function moves the ball back to the center and flips its direction.
// It's like resetting the board after someone scores a goal.
function resetBall() {
    const diff = difficulties[currentDifficulty];
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // STUDENT: We stop the ball from moving for a moment (the "Readiness Delay").
    // This gives the player 1 second to get ready for the next round.
    ballMoving = false;
    ball.speedX = 0;
    ball.speedY = 0;

    // STUDENT: setTimeout is a "Digital Kitchen Timer." 
    // It waits for 1000 milliseconds (1 second) then runs the code inside it.
    setTimeout(() => {
        // Only start if the game is still running (hasn't ended during the pause)
        if (gameRunning) {
            // Pick a random direction (left or right) for the new point
            ball.speedX = (Math.random() > 0.5) ? -diff.ballSpeed : diff.ballSpeed;
            // Pick a random up or down angle (Flip a coin!)
            ball.speedY = diff.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
            ballMoving = true;
        }
    }, 1000);
}

// STUDENT: Collision detection is checking for "Overlapping Boxes."
// We assume the ball and paddle are both rectangles. We ask:
// "Are these two rectangles touching each other?"
function collision(b, p) {
    return b.x + b.radius > p.x &&
        b.x - b.radius < p.x + paddleWidth &&
        b.y + b.radius > p.y &&
        b.y - b.radius < p.y + paddleHeight;
}

function update() {
    // STUDENT: Only move the ball if the game is actually "Running"
    if (!gameRunning) return;

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // 1. WALL BOUNCING
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // 2. AI MOVEMENT (The Brain of the Computer)
    // STUDENT: The computer looks at where the ball is and tries to move its paddle there.
    let aiSpeed = difficulties[currentDifficulty].aiSpeed;

    // We calculate the center of the AI paddle
    let aiPaddleCenter = ai.y + paddleHeight / 2;

    // Move towards the ball's Y position
    if (aiPaddleCenter < ball.y - 10) {
        ai.y += aiSpeed;
    } else if (aiPaddleCenter > ball.y + 10) {
        ai.y -= aiSpeed;
    }

    // 3. PADDLE COLLISIONS
    let playerOrAi = (ball.speedX < 0) ? player : ai;

    if (collision(ball, playerOrAi)) {
        ball.speedX = -ball.speedX;
        // Make it slightly faster every hit!
        ball.speedX *= 1.1;
    }

    // 4. SCORING
    if (ball.x - ball.radius < 0) {
        ai.score++;
        // STUDENT: Update the numbers on the screen!
        document.getElementById('ai-score').innerText = ai.score;
        checkWin();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        document.getElementById('player-score').innerText = player.score;
        checkWin();
    }
}

// --- 5. GAME FLOW (Menu & Win/Loss) ---

// STUDENT: This function checks if anyone has reached 10 points!
function checkWin() {
    if (player.score >= 10 || ai.score >= 10) {
        gameRunning = false;
        // STUDENT: Use our "Magic Class" (.hidden) to switch screens.
        // We hide the score HUD and show the Game Over screen.
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');

        // Show who the winner is!
        document.getElementById('winner-text').innerText =
            player.score >= 10 ? "PLAYER WINS!" : "COMPUTER WINS!";
    } else {
        // If nobody has 10 points yet, reset for the next round.
        resetBall();
    }
}

// STUDENT: This function starts a brand new game for us!
function startGame(difficulty) {
    currentDifficulty = difficulty;
    player.score = 0;
    ai.score = 0;

    // STUDENT: We must also update the screen so it shows "0 : 0"!
    document.getElementById('player-score').innerText = player.score;
    document.getElementById('ai-score').innerText = ai.score;

    // Reset the paddle positions to the middle
    player.y = canvas.height / 2 - paddleHeight / 2;
    ai.y = canvas.height / 2 - paddleHeight / 2;

    // STUDENT: Hide the menu screens and show the game board and scoreboard.
    gameRunning = true;
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');

    // Fire the first ball!
    resetBall();
}

// --- 6. EVENT LISTENERS (Connecting Buttons) ---

canvas.addEventListener('mousemove', (event) => {
    if (!gameRunning) return;
    let rect = canvas.getBoundingClientRect();
    let mouseY = event.clientY - rect.top;
    player.y = mouseY - paddleHeight / 2;
});

// STUDENT: These listeners tell the logic when a button is clicked.
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

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

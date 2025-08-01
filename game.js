// Canvas setup
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_RADIUS = 11;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 8;
const BALL_SPEED = 6;

// Game variables
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = (Math.random() - 0.5) * BALL_SPEED;

let playerScore = 0;
let aiScore = 0;

// Mouse control for left paddle
canvas.addEventListener('mousemove', function (evt) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = evt.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp in bounds
  if (playerY < 0) playerY = 0;
  if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Update positions
function update() {
  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Wall collision (top & bottom)
  if (ballY - BALL_RADIUS < 0) {
    ballY = BALL_RADIUS;
    ballSpeedY *= -1;
  }
  if (ballY + BALL_RADIUS > canvas.height) {
    ballY = canvas.height - BALL_RADIUS;
    ballSpeedY *= -1;
  }

  // Player paddle collision
  if (
    ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
    ballY > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
    ballSpeedX *= -1;
    // Add a bit of "spin" based on where it hits the paddle
    let collidePoint = ballY - (playerY + PADDLE_HEIGHT / 2);
    ballSpeedY = collidePoint * 0.25;
  }

  // AI paddle collision
  if (
    ballX + BALL_RADIUS > AI_X &&
    ballY > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballX = AI_X - BALL_RADIUS;
    ballSpeedX *= -1;
    let collidePoint = ballY - (aiY + PADDLE_HEIGHT / 2);
    ballSpeedY = collidePoint * 0.25;
  }

  // Left & right wall (score)
  if (ballX - BALL_RADIUS < 0) {
    aiScore++;
    resetBall(-1);
  }
  if (ballX + BALL_RADIUS > canvas.width) {
    playerScore++;
    resetBall(1);
  }

  // AI movement (basic)
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY - 16) {
    aiY += PADDLE_SPEED;
  } else if (aiCenter > ballY + 16) {
    aiY -= PADDLE_SPEED;
  }
  // Clamp AI paddle in bounds
  if (aiY < 0) aiY = 0;
  if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Reset ball for new round
function resetBall(direction) {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = BALL_SPEED * direction;
  ballSpeedY = (Math.random() - 0.5) * BALL_SPEED * 2;
}

// Draw everything
function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Net
  for (let i = 10; i < canvas.height; i += 28) {
    ctx.fillStyle = "#fff3";
    ctx.fillRect(canvas.width / 2 - 2, i, 4, 18);
  }

  // Paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "#f5dd00";
  ctx.shadowColor = "#f5dd00";
  ctx.shadowBlur = 16;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.closePath();

  // Scores
  ctx.font = "36px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(playerScore, canvas.width / 4, 50);
  ctx.fillText(aiScore, 3 * canvas.width / 4, 50);
}

gameLoop();

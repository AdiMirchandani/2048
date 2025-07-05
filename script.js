const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // Use '2d' for 2D graphics
const hitButton = document.getElementById('hitButton');

// Game State
let score = 0;
let ballX = 50;
let ballY = 150;
let ballSpeedX = 2;

// Player (Bat)
let batX = 300;
let batY = 130;
let batWidth = 20;
let batHeight = 40;


function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);  // x, y, radius, startAngle, endAngle
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();

  // Draw the bat
  ctx.fillStyle = "blue";
  ctx.fillRect(batX, batY, batWidth, batHeight);

  // Display the score
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 10, 20);
}


function update() {
  ballX += ballSpeedX;

  // Bounce off walls
  if (ballX + 10 > canvas.width || ballX - 10 < 0) {
    ballSpeedX = -ballSpeedX;
  }

  // Collision Detection (Very simple)
  if (ballX + 10 > batX && ballX - 10 < batX + batWidth &&
      ballY + 10 > batY && ballY - 10 < batY + batHeight) {
    score++;
    ballSpeedX = -ballSpeedX; // Ball bounces back
  }
}


function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop); // Call gameLoop again
}

// Event Listener for the Hit Button
hitButton.addEventListener('click', () => {
  // Simulate a hit (you'd need more complex logic here)
  batY = Math.random() * (canvas.height - batHeight); // Move bat randomly
});


// Start the game loop
gameLoop();

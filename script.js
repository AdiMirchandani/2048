const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hitButton = document.getElementById('hitButton');
const scoreDisplay = document.getElementById('scoreDisplay');
const messageDisplay = document.getElementById('messageDisplay');

// Game Constants
const BAT_WIDTH = 30;
const BAT_HEIGHT = 60;
const BALL_RADIUS = 12;

// Game State
let score = 0;
let ballX = 100;
let ballY = canvas.height / 2;
let ballSpeedX = 0;  // Initially no movement
let ballSpeedY = 0;
let bowlingStyle = "fast"; // Default bowling style
let isBallMoving = false;
let onStrikeBatsman = 1; // 1 or 2
let ballsBowledThisOver = 0;

// Batsman positions (simplified)
let batsman1X = canvas.width * 0.8;
let batsman1Y = canvas.height / 2;
let batsman2X = canvas.width * 0.7;
let batsman2Y = canvas.height / 2;

// Bat position
let batX = batsman1X - BAT_WIDTH;
let batY = batsman1Y - BAT_HEIGHT/2;

// Function to draw the batsmen
function drawBatsmen() {
    ctx.fillStyle = "brown";
    ctx.fillRect(batsman1X, batsman1Y - BAT_HEIGHT/2, BAT_WIDTH, BAT_HEIGHT); // Striking batsman
    ctx.fillRect(batsman2X, batsman2Y - BAT_HEIGHT/2, BAT_WIDTH, BAT_HEIGHT); // Non-striking
}

// Function to draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

// Function to draw the bat
function drawBat() {
    ctx.fillStyle = "blue";
    ctx.fillRect(batX, batY, BAT_WIDTH, BAT_HEIGHT);
}

function resetBall() {
    ballX = 100;
    ballY = canvas.height / 2;
    ballSpeedX = 0;
    ballSpeedY = 0;
    isBallMoving = false;
    batX = batsman1X - BAT_WIDTH;
    batY = batsman1Y - BAT_HEIGHT/2;
}

function bowlBall() {
    if (!isBallMoving) {
        // Randomize bowling style (simplified)
        const styles = ["fast", "spin"];
        bowlingStyle = styles[Math.floor(Math.random() * styles.length)];

        // Set initial ball speed based on style
        ballSpeedX = bowlingStyle === "fast" ? 5 : 3;
        ballSpeedY = (Math.random() - 0.5) * 2; // Slight vertical variation
        isBallMoving = true;
        messageDisplay.textContent = "Bowling: " + bowlingStyle;
    }
}

function hitBall() {
    if (isBallMoving) {
        // Timing matters!
        const distance = Math.abs(ballX - batX);
        let hitPower = 0;

        if (distance < 20) {
            // Good timing - potential for a six
            hitPower = 6;
            messageDisplay.textContent = "SIX!!!";
        } else if (distance < 50) {
            // Decent timing - chance for runs
            hitPower = Math.floor(Math.random() * 4) + 1; // 1, 2, 3, or 4
            messageDisplay.textContent = hitPower + " runs!";
        } else {
            // Poor timing - probably no runs
            hitPower = Math.floor(Math.random() * 3); // 0, 1, or 2
            messageDisplay.textContent = hitPower + " runs!";
        }

        score += hitPower;
        scoreDisplay.textContent = "Score: " + score;

        resetBall();
        ballsBowledThisOver++;

        if (hitPower % 2 !== 0) {
            switchBatsmen();
        }

        if (ballsBowledThisOver >= 6) {
            switchOver();
        }

        if (ballsBowledThisOver < 6){
            setTimeout(bowlBall, 1500);
        }
    } else {
        messageDisplay.textContent = "Press Space to Bowl!";
    }
}

function switchBatsmen() {
    // Simple swap of batsman positions (you'd need more complex logic for running)
    [batsman1X, batsman2X] = [batsman2X, batsman1X];
    [batsman1Y, batsman2Y] = [batsman2Y, batsman1Y];
    onStrikeBatsman = (onStrikeBatsman === 1) ? 2 : 1;
    batX = batsman1X - BAT_WIDTH;
    batY = batsman1Y - BAT_HEIGHT/2;
    messageDisplay.textContent = "Batsmen switched!";
}

function switchOver() {
    ballsBowledThisOver = 0;
    switchBatsmen(); // Automatically switch batsmen at the end of the over
    messageDisplay.textContent = "Over Complete! Batsmen switched.";
    setTimeout(bowlBall, 1500); // Bowl the next ball automatically
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBatsmen();
    drawBall();
    drawBat();
}

function update() {
    if (isBallMoving) {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Basic boundary check (ball goes off-screen)
        if (ballX > canvas.width + BALL_RADIUS) {
            resetBall();
            ballsBowledThisOver++;

            if (ballsBowledThisOver >= 6) {
                switchOver();
            } else {
                setTimeout(bowlBall, 1500);
            }
        }
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Event Listeners
hitButton.addEventListener('click', hitBall);

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (!isBallMoving) {
            bowlBall();
        } else {
            hitBall();
        }
    }
});

// Start the game
gameLoop();

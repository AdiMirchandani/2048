const gameContainer = document.querySelector('.game-container');
const gridContainer = document.querySelector('.grid-container');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best');
const worldRecordElement = document.getElementById('world-record');
const restartButton = document.getElementById('restart');
const gameMessage = document.querySelector('.game-message');
const keepPlayingButton = document.querySelector('.keep-playing-button');

const gridSize = 4;
const tileColors = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e'
};

let board = [];
let score = 0;
let bestScore = 0;
let worldRecord = 0;
let hasWon = false;

// Initialize game
function initGame() {
    board = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    score = 0;
    scoreElement.textContent = '0';
    
    // Remove all existing tiles and animations
    const tiles = document.querySelectorAll('.tile, .confetti, .game-over-overlay');
    tiles.forEach(tile => tile.remove());
    
    // Add two initial tiles with fade-in animation
    addRandomTile(true);
    addRandomTile(true);
    
    updateBestScore();
    hasWon = false;
    gameMessage.style.display = 'none';
    
    // Reset game container scale
    gameContainer.style.transform = 'scale(1)';
}

// Add random tile (2 or 4)
function addRandomTile(withAnimation = false) {
    const emptyCells = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }
    
    if (emptyCells.length === 0) return false;
    
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    board[randomCell.row][randomCell.col] = value;
    
    const tile = document.createElement('div');
    tile.className = 'tile tile-' + value;
    tile.textContent = value;
    
    const cell = gridContainer.children[randomCell.row].children[randomCell.col];
    // Center the tile within the cell by using getBoundingClientRect for accurate positioning
    const cellRect = cell.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();
    tile.style.left = (cellRect.left - containerRect.left) + 'px';
    tile.style.top = (cellRect.top - containerRect.top) + 'px';
    
    gameContainer.appendChild(tile);
    
    if (withAnimation) {
        tile.style.opacity = '0';
        tile.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            tile.style.opacity = '1';
            tile.style.transform = 'scale(1)';
            tile.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        }, 10);
    }
    
    return true;
}

// Update best score
function updateBestScore() {
    const currentBest = parseInt(localStorage.getItem('bestScore') || '0');
    bestScore = Math.max(score, currentBest);
    localStorage.setItem('bestScore', bestScore);
    bestScoreElement.textContent = bestScore;
}

// Move tiles in a direction
function moveTiles(direction) {
    console.log('moveTiles called with direction:', direction);
    console.log('Current board:', board);
    let moved = false;
    let newBoard = JSON.parse(JSON.stringify(board));
    
    // Add a small delay before movement to create a smooth effect
    gameContainer.style.transform = 'scale(0.98)';
    setTimeout(() => {
        gameContainer.style.transform = 'scale(1)';
    }, 50);
    
    switch (direction) {
        case 'left':
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    if (newBoard[i][j] !== 0) {
                        let k = j;
                        while (k > 0 && newBoard[i][k-1] === 0) {
                            newBoard[i][k-1] = newBoard[i][k];
                            newBoard[i][k] = 0;
                            k--;
                            moved = true;
                        }
                        if (k > 0 && newBoard[i][k-1] === newBoard[i][k]) {
                            newBoard[i][k-1] *= 2;
                            newBoard[i][k] = 0;
                            score += newBoard[i][k-1];
                            moved = true;
                            if (newBoard[i][k-1] === 2048 && !hasWon) {
                                showWinMessage();
                            }
                        }
                    }
                }
            }
            break;
        
        case 'right':
            for (let i = 0; i < gridSize; i++) {
                for (let j = gridSize - 1; j >= 0; j--) {
                    if (newBoard[i][j] !== 0) {
                        let k = j;
                        while (k < gridSize - 1 && newBoard[i][k+1] === 0) {
                            newBoard[i][k+1] = newBoard[i][k];
                            newBoard[i][k] = 0;
                            k++;
                            moved = true;
                        }
                        if (k < gridSize - 1 && newBoard[i][k+1] === newBoard[i][k]) {
                            newBoard[i][k+1] *= 2;
                            newBoard[i][k] = 0;
                            score += newBoard[i][k+1];
                            moved = true;
                            if (newBoard[i][k+1] === 2048 && !hasWon) {
                                showWinMessage();
                            }
                        }
                    }
                }
            }
            break;
        
        case 'up':
            for (let j = 0; j < gridSize; j++) {
                for (let i = 0; i < gridSize; i++) {
                    if (newBoard[i][j] !== 0) {
                        let k = i;
                        while (k > 0 && newBoard[k-1][j] === 0) {
                            newBoard[k-1][j] = newBoard[k][j];
                            newBoard[k][j] = 0;
                            k--;
                            moved = true;
                        }
                        if (k > 0 && newBoard[k-1][j] === newBoard[k][j]) {
                            newBoard[k-1][j] *= 2;
                            newBoard[k][j] = 0;
                            score += newBoard[k-1][j];
                            moved = true;
                            if (newBoard[k-1][j] === 2048 && !hasWon) {
                                showWinMessage();
                            }
                        }
                    }
                }
            }
            break;
        
        case 'down':
            for (let j = 0; j < gridSize; j++) {
                for (let i = gridSize - 1; i >= 0; i--) {
                    if (newBoard[i][j] !== 0) {
                        let k = i;
                        while (k < gridSize - 1 && newBoard[k+1][j] === 0) {
                            newBoard[k+1][j] = newBoard[k][j];
                            newBoard[k][j] = 0;
                            k++;
                            moved = true;
                        }
                        if (k < gridSize - 1 && newBoard[k+1][j] === newBoard[k][j]) {
                            newBoard[k+1][j] *= 2;
                            newBoard[k][j] = 0;
                            score += newBoard[k+1][j];
                            moved = true;
                            if (newBoard[k+1][j] === 2048 && !hasWon) {
                                showWinMessage();
                            }
                        }
                    }
                }
            }
            break;
    }
    
    console.log('moved:', moved);
    if (moved) {
        console.log('Move detected! Updating board...');
        board = newBoard;
        updateBoard();
        setTimeout(() => {
            addRandomTile();
        }, 200);
        updateBestScore();
        scoreElement.textContent = score;
        checkGameOver();
    } else {
        console.log('No valid move detected');
    }
}

// Update board display
function updateBoard() {
    console.log('Updating board display...');
    
    // Remove all existing tiles
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => tile.remove());
    
    // Create new tiles based on current board state
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (board[i][j] !== 0) {
                const tile = document.createElement('div');
                tile.className = 'tile tile-' + board[i][j];
                tile.textContent = board[i][j];
                
                // Get the position of the grid cell and center the tile
                const cell = gridContainer.children[i].children[j];
                // Center the tile within the cell by adding half the difference between cell and tile sizes
                const cellRect = cell.getBoundingClientRect();
                const containerRect = gameContainer.getBoundingClientRect();
                tile.style.left = (cellRect.left - containerRect.left) + 'px';
                tile.style.top = (cellRect.top - containerRect.top) + 'px';
                
                gameContainer.appendChild(tile);
                
                // Add smooth appearance animation
                tile.style.transform = 'scale(0.8)';
                tile.style.opacity = '0.8';
                setTimeout(() => {
                    tile.style.transform = 'scale(1)';
                    tile.style.opacity = '1';
                }, 50);
            }
        }
    }
    
    scoreElement.textContent = score;
    updateBestScore();
}

// Show win message
function showWinMessage() {
    gameMessage.style.display = 'block';
    gameMessage.querySelector('p').textContent = 'You win!';
    hasWon = true;
    
    // Add confetti animation
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    gameContainer.appendChild(confetti);
    
    // Add win sound
    const winSound = new Audio('win.mp3');
    winSound.play();
    
    // Add win message animation
    const message = gameMessage.querySelector('p');
    message.style.transform = 'scale(1)';
    message.style.opacity = '1';
    
    setTimeout(() => {
        message.style.transform = 'scale(1.2)';
        message.style.opacity = '0';
    }, 2000);
    
    setTimeout(() => {
        confetti.remove();
        message.style.transform = 'scale(1)';
        message.style.opacity = '1';
    }, 3000);
}

// Check if game is over
function checkGameOver() {
    if (!hasAvailableMoves()) {
        gameMessage.style.display = 'block';
        gameMessage.querySelector('p').textContent = 'Game Over!';
        
        // Add game over animation
        const gameOverOverlay = document.createElement('div');
        gameOverOverlay.className = 'game-over-overlay';
        gameContainer.appendChild(gameOverOverlay);
        
        // Add game over sound
        const gameOverSound = new Audio('gameover.mp3');
        gameOverSound.play();
        
        // Add game over message animation
        const message = gameMessage.querySelector('p');
        message.style.transform = 'scale(1)';
        message.style.opacity = '1';
        
        setTimeout(() => {
            message.style.transform = 'scale(1.2)';
            message.style.opacity = '0';
        }, 2000);
        
        setTimeout(() => {
            gameOverOverlay.remove();
            message.style.transform = 'scale(1)';
            message.style.opacity = '1';
        }, 3000);
    }
}

// Check if there are available moves
function hasAvailableMoves() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (board[i][j] === 0) return true;
            
            if (i > 0 && board[i][j] === board[i-1][j]) return true;
            if (i < gridSize - 1 && board[i][j] === board[i+1][j]) return true;
            if (j > 0 && board[i][j] === board[i][j-1]) return true;
            if (j < gridSize - 1 && board[i][j] === board[i][j+1]) return true;
        }
    }
    return false;
}

// Event listeners
restartButton.addEventListener('click', () => {
    initGame();
    gameMessage.style.display = 'none';
});

// Touch support
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

gridContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

gridContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 50) {
            moveTiles('right');
        } else if (deltaX < -50) {
            moveTiles('left');
        }
    } else {
        if (deltaY > 50) {
            moveTiles('down');
        } else if (deltaY < -50) {
            moveTiles('up');
        }
    }
});

document.addEventListener('keydown', (e) => {
    console.log('Key pressed:', e.key);
    if (gameMessage.style.display === 'block') return;
    
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            console.log('Moving up');
            moveTiles('up');
            break;
        case 'ArrowDown':
            e.preventDefault();
            console.log('Moving down');
            moveTiles('down');
            break;
        case 'ArrowLeft':
            e.preventDefault();
            console.log('Moving left');
            moveTiles('left');
            break;
        case 'ArrowRight':
            e.preventDefault();
            console.log('Moving right');
            moveTiles('right');
            break;
    }
});

// Initialize game
initGame();

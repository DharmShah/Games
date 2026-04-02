class PatternMemoryGame {
    constructor() {
        this.gridSize = 5; // Start with 5x5
        this.level = 1;
        this.score = 0;
        this.patternLength = 3; // Starting with 3 boxes in pattern
        this.boxes = [];
        this.boxMap = {}; // Map to store boxes by row/col
        this.pattern = []; // Array of [row, col] coordinates
        this.userPattern = []; // Array of [row, col] coordinates user selected
        this.selectedBoxes = new Set();
        this.gameOverTimeoutId = null;
        this.gameActive = false;
        this.isShowingPattern = false;
        this.canClick = false;
        this.showDuration = 3000; // 3 seconds to show pattern

        this.initializeElements();
        this.createGrid();
        this.updateBoardLayout();
        this.attachEventListeners();
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
    }

    initializeElements() {
        this.containerEl = document.getElementById('boxesContainer');
        this.boardShellEl = this.containerEl.parentElement;
        this.statusEl = document.getElementById('status');
        this.levelEl = document.getElementById('level');
        this.patternLengthEl = document.getElementById('patternLength');
        this.scoreEl = document.getElementById('score');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
    }

    createGrid() {
        this.containerEl.innerHTML = '';
        this.boxes = [];
        this.boxMap = {};

        // Update grid columns in parent container
        this.containerEl.style.gridTemplateColumns = `repeat(${this.gridSize}, minmax(0, 1fr))`;

        for (let row = 1; row <= this.gridSize; row++) {
            for (let col = 1; col <= this.gridSize; col++) {
                const box = document.createElement('div');
                box.className = 'box';
                // Plain box - no numbers
                box.dataset.row = row;
                box.dataset.col = col;

                // Tailwind CSS classes with larger size
                box.classList.add(
                    'w-full', 'aspect-square', 'flex', 'items-center', 'justify-center',
                    'border-2', 'border-purple-400', 'rounded-xl', 'font-bold',
                    'text-sm', 'sm:text-lg', 'cursor-pointer', 'bg-gradient-to-br',
                    'from-purple-300', 'to-pink-300',
                    'hover:scale-[1.04]', 'transform', 'transition-all', 'duration-200',
                    'hover:shadow-lg', 'hover:from-purple-400', 'hover:to-pink-400'
                );

                this.containerEl.appendChild(box);
                this.boxes.push(box);
                this.boxMap[`${row},${col}`] = box;
            }
        }

        this.updateBoardLayout();
    }

    handleResize() {
        this.updateBoardLayout();
    }

    updateBoardLayout() {
        if (!this.containerEl || !this.boardShellEl || this.boxes.length === 0) {
            return;
        }

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const horizontalGap = viewportWidth >= 640 ? 12 : 8;
        const boardWidth = this.boardShellEl.clientWidth || viewportWidth;
        const availableWidth = Math.max(260, Math.floor(boardWidth - 8));
        const availableHeight = Math.max(260, Math.floor(viewportHeight * (viewportWidth >= 1024 ? 0.68 : 0.52)));
        const sizeFromWidth = Math.floor((availableWidth - horizontalGap * (this.gridSize - 1)) / this.gridSize);
        const sizeFromHeight = Math.floor((availableHeight - horizontalGap * (this.gridSize - 1)) / this.gridSize);
        const cellSize = Math.max(42, Math.min(sizeFromWidth, sizeFromHeight));
        const boardSize = (cellSize * this.gridSize) + (horizontalGap * (this.gridSize - 1));

        this.containerEl.style.gridTemplateColumns = `repeat(${this.gridSize}, ${cellSize}px)`;
        this.containerEl.style.gap = `${horizontalGap}px`;
        this.containerEl.style.width = `${boardSize}px`;
        this.containerEl.style.maxWidth = '100%';

        this.boxes.forEach((box) => {
            box.style.width = `${cellSize}px`;
            box.style.height = `${cellSize}px`;
        });
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());

        this.boxes.forEach((box) => {
            box.addEventListener('click', (e) => {
                if (this.gameActive && this.canClick && !this.isShowingPattern) {
                    const row = parseInt(box.dataset.row);
                    const col = parseInt(box.dataset.col);
                    this.handleBoxClick(row, col, box);
                }
            });
        });
    }

    startGame() {
        if (this.gameActive) return;

        if (this.gameOverTimeoutId) {
            clearTimeout(this.gameOverTimeoutId);
            this.gameOverTimeoutId = null;
        }

        this.gameActive = true;
        this.pattern = [];
        this.userPattern = [];
        this.level = 1;
        this.score = 0;
        this.patternLength = 3;
        this.startBtn.disabled = true;

        this.updateUI();
        this.logMessage('Game started!', 'success');
        this.generateNewPattern();
    }

    generateNewPattern() {
        this.clearSelectedHighlights();
        this.userPattern = [];

        // Generate a new random coordinate for the pattern
        const newRow = Math.floor(Math.random() * this.gridSize) + 1;
        const newCol = Math.floor(Math.random() * this.gridSize) + 1;
        this.pattern.push([newRow, newCol]);

        // Log the expected pattern
        const patternDisplay = this.pattern.map(p => `${p[0]}/${p[1]}`).join(', ');
        this.logMessage(`Pattern: ${patternDisplay}`, 'info');

        setTimeout(() => {
            this.showPattern();
        }, 500);
    }

    showPattern() {
        this.isShowingPattern = true;
        this.canClick = false;
        this.updateStatus('Watching pattern... remember the boxes!');

        // Highlight all pattern boxes at the same time
        this.pattern.forEach((coords) => {
            const box = this.boxMap[`${coords[0]},${coords[1]}`];
            this.highlightBox(box);
        });

        // After 3 seconds, allow user to select
        setTimeout(() => {
            this.isShowingPattern = false;
            this.canClick = true;
            this.updateStatus(`Your turn! Select ${this.pattern.length} boxes in any order`, 'normal');
        }, this.showDuration);
    }

    highlightBox(box) {
        // Add highlight animation
        box.classList.remove(
            'from-purple-300', 'to-pink-300', 'text-gray-800'
        );
        box.classList.add(
            'from-yellow-300', 'to-orange-300', 'text-black',
            'animate-pulse', 'shadow-2xl'
        );

        // Remove highlight after 3 seconds
        setTimeout(() => {
            box.classList.remove(
                'from-yellow-300', 'to-orange-300', 'text-black',
                'animate-pulse', 'shadow-2xl'
            );
            box.classList.add(
                'from-purple-300', 'to-pink-300', 'text-gray-800'
            );
        }, this.showDuration);
    }

    handleBoxClick(row, col, box) {
        // Visual feedback for user click
        this.setSelectedBoxVisual(box);

        // Add to user pattern
        this.userPattern.push([row, col]);

        // Check if this coordinate exists in the pattern
        const coordinateExists = this.pattern.some(p => p[0] === row && p[1] === col);

        if (!coordinateExists) {
            this.handleWrongPattern(`Box at ${row}/${col} is not in the pattern!`);
            return;
        }

        // Check if user already selected this same box
        const alreadySelected = this.userPattern.slice(0, -1).some(p => p[0] === row && p[1] === col);
        if (alreadySelected) {
            this.handleWrongPattern(`You already selected ${row}/${col}!`);
            return;
        }

        // Check if user has completed the pattern (selected all boxes)
        if (this.userPattern.length === this.pattern.length) {
            this.handleCorrectPattern();
        }
    }

    setSelectedBoxVisual(box) {
        const boxKey = `${box.dataset.row},${box.dataset.col}`;
        this.selectedBoxes.add(boxKey);
        box.classList.add(
            'ring-4', 'ring-green-500', 'bg-green-400', 'from-green-300',
            'to-emerald-400', 'text-white', 'shadow-xl', 'scale-[1.06]'
        );
    }

    clearSelectedHighlights() {
        this.selectedBoxes.forEach((boxKey) => {
            const box = this.boxMap[boxKey];
            if (!box) {
                return;
            }

            box.classList.remove(
                'ring-4', 'ring-green-500', 'bg-green-400', 'from-green-300',
                'to-emerald-400', 'text-white', 'shadow-xl', 'scale-[1.06]'
            );
        });

        this.selectedBoxes.clear();
    }

    handleCorrectPattern() {
        this.canClick = false;
        this.score += 10;
        this.level++;
        this.patternLength++;

        this.updateStatus('✓ Correct! Pattern matched!', 'correct');
        this.logMessage(`Level ${this.level - 1} passed! Score: ${this.score}`, 'success');

        // Increase grid complexity every 4 levels
        if (this.level % 4 === 0 && this.gridSize < 8) {
            this.gridSize++;
            this.createGrid();
            this.attachEventListeners();
            this.logMessage(`🔥 Grid increased to ${this.gridSize}x${this.gridSize}! Difficulty increased!`, 'success');
        }

        this.updateUI();
        this.updateBoardLayout();

        setTimeout(() => {
            this.generateNewPattern();
        }, 1500);
    }

    handleWrongPattern(message) {
        this.canClick = false;
        this.gameActive = false;
        this.updateStatus(`✗ Wrong! ${message} Game Over`, 'wrong');
        this.logMessage(`Game Over! Final Score: ${this.score} | Max Level: ${this.level}`, 'error');

        this.startBtn.disabled = false;

        if (this.gameOverTimeoutId) {
            clearTimeout(this.gameOverTimeoutId);
        }

        this.gameOverTimeoutId = setTimeout(() => {
            this.gameOverTimeoutId = null;
            this.resetGame();
        }, 5000);
    }

    updateStatus(message, style = 'normal') {
        this.statusEl.textContent = message;

        // Remove all status styles
        this.statusEl.classList.remove(
            'bg-blue-100', 'border-blue-500', 'text-blue-800',
            'bg-green-100', 'border-green-500', 'text-green-800',
            'bg-red-100', 'border-red-500', 'text-red-800'
        );

        // Add appropriate status style
        if (style === 'correct') {
            this.statusEl.classList.add('bg-green-100', 'border-green-500', 'text-green-800');
        } else if (style === 'wrong') {
            this.statusEl.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
        } else {
            this.statusEl.classList.add('bg-blue-100', 'border-blue-500', 'text-blue-800');
        }
    }

    updateUI() {
        this.levelEl.textContent = this.level;
        this.patternLengthEl.textContent = this.patternLength;
        this.scoreEl.textContent = this.score;
    }

    logMessage(message, type = 'normal') {
        return;
    }

    resetGame() {
        if (this.gameOverTimeoutId) {
            clearTimeout(this.gameOverTimeoutId);
            this.gameOverTimeoutId = null;
        }

        this.gameActive = false;
        this.isShowingPattern = false;
        this.canClick = false;
        this.level = 1;
        this.score = 0;
        this.patternLength = 3;
        this.gridSize = 5; // Reset to 5x5
        this.pattern = [];
        this.userPattern = [];
        this.clearSelectedHighlights();

        this.createGrid();
        this.attachEventListeners();
        this.updateUI();
        this.updateBoardLayout();
        this.updateStatus('Game reset! Click "Start Game" to begin!');
        this.startBtn.disabled = false;
        this.logMessage('Game reset successfully', 'success');
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PatternMemoryGame();
});

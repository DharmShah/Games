const boardEl = document.getElementById("board");
const resetBtn = document.getElementById("resetBtn");
const timeEl = document.getElementById("time");
const movesEl = document.getElementById("moves");
const pairsEl = document.getElementById("pairs");
const messageEl = document.getElementById("message");

const symbols = ["A", "B", "C", "D", "E", "F", "G", "H"];
const totalPairs = symbols.length;

let cards = [];
let firstPick = null;
let secondPick = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timerId = null;
let elapsed = 0;
let gameActive = false;

const pad = (value) => String(value).padStart(2, "0");

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${pad(minutes)}:${pad(secs)}`;
};

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const updateStats = () => {
    movesEl.textContent = moves;
    pairsEl.textContent = totalPairs - matches;
    timeEl.textContent = formatTime(elapsed);
};

const startTimer = () => {
    if (timerId) return;
    timerId = setInterval(() => {
        elapsed += 1;
        timeEl.textContent = formatTime(elapsed);
    }, 1000);
};

const stopTimer = () => {
    clearInterval(timerId);
    timerId = null;
};

const resetGameState = () => {
    cards = [];
    firstPick = null;
    secondPick = null;
    lockBoard = false;
    moves = 0;
    matches = 0;
    elapsed = 0;
    gameActive = false;
    stopTimer();
    messageEl.textContent = "";
    updateStats();
};

const buildCard = (symbol, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.symbol = symbol;
    button.dataset.index = index;
    button.className =
        "group relative flex h-20 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-md shadow-slate-900/20 transition duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-900/30";

    const face = document.createElement("span");
    face.textContent = symbol;
    face.className =
        "opacity-0 transition duration-300 group-[.revealed]:opacity-100";

    const cover = document.createElement("span");
    cover.textContent = "?";
    cover.className =
        "absolute inset-0 flex items-center justify-center rounded-2xl bg-white text-slate-800 transition duration-300 group-[.revealed]:opacity-0";

    button.appendChild(face);
    button.appendChild(cover);

    return button;
};

const renderBoard = () => {
    boardEl.innerHTML = "";
    const deck = shuffle([...symbols, ...symbols]);
    cards = deck.map((symbol, index) => ({
        symbol,
        index,
        matched: false,
    }));

    cards.forEach((card) => {
        const cardEl = buildCard(card.symbol, card.index);
        cardEl.addEventListener("click", () => handleCardClick(card, cardEl));
        boardEl.appendChild(cardEl);
    });
};

const revealCard = (cardEl) => {
    cardEl.classList.add("revealed");
};

const hideCard = (cardEl) => {
    cardEl.classList.remove("revealed");
};

const handleMatch = () => {
    matches += 1;
    messageEl.textContent = "Nice! Keep going.";
    updateStats();

    if (matches === totalPairs) {
        stopTimer();
        messageEl.textContent = `All pairs found in ${moves} moves and ${formatTime(elapsed)}!`;
    }
};

const handleMismatch = (firstEl, secondEl) => {
    lockBoard = true;
    setTimeout(() => {
        hideCard(firstEl);
        hideCard(secondEl);
        lockBoard = false;
    }, 800);
};

const handleCardClick = (card, cardEl) => {
    if (lockBoard || card.matched || cardEl.classList.contains("revealed")) {
        return;
    }

    if (!gameActive) {
        gameActive = true;
        startTimer();
    }

    revealCard(cardEl);

    if (!firstPick) {
        firstPick = { card, el: cardEl };
        return;
    }

    secondPick = { card, el: cardEl };
    moves += 1;
    updateStats();

    if (firstPick.card.symbol === secondPick.card.symbol) {
        firstPick.card.matched = true;
        secondPick.card.matched = true;
        handleMatch();
        firstPick = null;
        secondPick = null;
        return;
    }

    handleMismatch(firstPick.el, secondPick.el);
    firstPick = null;
    secondPick = null;
};

const startNewGame = () => {
    resetGameState();
    renderBoard();
    updateStats();
};

resetBtn.addEventListener("click", startNewGame);

startNewGame();

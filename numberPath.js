const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const levelLabelEl = document.getElementById("levelLabel");
const progressLabelEl = document.getElementById("progressLabel");
const checkpointLabelEl = document.getElementById("checkpointLabel");
const newPatternBtn = document.getElementById("newPatternBtn");
const restartLevelBtn = document.getElementById("restartLevelBtn");

const LEVELS = [
    { rows: 4, cols: 4, checkpoints: 5 },
    { rows: 4, cols: 5, checkpoints: 6 },
    { rows: 5, cols: 5, checkpoints: 7 },
    { rows: 5, cols: 6, checkpoints: 8 },
];

const DIRECTIONS = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
];

let game = {
    level: 1,
    rows: 4,
    cols: 4,
    path: [],
    selected: [],
    checkpoints: new Map(),
    checkpointByNumber: new Map(),
    dragging: false,
    pointerId: null,
};

function idx(row, col, cols) {
    return row * cols + col;
}

function isNeighbor(a, b, cols) {
    const ar = Math.floor(a / cols);
    const ac = a % cols;
    const br = Math.floor(b / cols);
    const bc = b % cols;
    return Math.abs(ar - br) + Math.abs(ac - bc) === 1;
}

function shuffled(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function generateHamiltonianPath(rows, cols) {
    const total = rows * cols;

    function neighbors(cell, visited) {
        const row = Math.floor(cell / cols);
        const col = cell % cols;
        const out = [];
        for (const [dr, dc] of DIRECTIONS) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
            const next = idx(nr, nc, cols);
            if (!visited[next]) out.push(next);
        }
        return out;
    }

    for (let attempt = 0; attempt < 220; attempt += 1) {
        const start = Math.floor(Math.random() * total);
        const visited = new Array(total).fill(false);
        const path = [start];
        visited[start] = true;

        function step() {
            if (path.length === total) return true;

            const current = path[path.length - 1];
            const options = shuffled(neighbors(current, visited)).sort((a, b) => {
                const degreeA = neighbors(a, visited).length;
                const degreeB = neighbors(b, visited).length;
                return degreeA - degreeB;
            });

            for (const next of options) {
                visited[next] = true;
                path.push(next);
                if (step()) return true;
                path.pop();
                visited[next] = false;
            }
            return false;
        }

        if (step()) return path;
    }

    return null;
}

function buildCheckpoints(path, checkpointCount) {
    const checkpoints = new Map();
    const checkpointByNumber = new Map();
    const lastIndex = path.length - 1;

    for (let number = 1; number <= checkpointCount; number += 1) {
        const pathIndex = Math.round(((number - 1) * lastIndex) / (checkpointCount - 1));
        const cell = path[pathIndex];
        checkpoints.set(cell, number);
        checkpointByNumber.set(number, { cell, pathIndex });
    }

    return { checkpoints, checkpointByNumber };
}

function currentReachedCheckpoint() {
    let reached = 0;
    for (let i = 0; i < game.selected.length; i += 1) {
        const cell = game.selected[i];
        const number = game.checkpoints.get(cell);
        if (number) reached = Math.max(reached, number);
    }
    return reached;
}

function renderBoard() {
    boardEl.style.gridTemplateColumns = `repeat(${game.cols}, minmax(0, 1fr))`;
    boardEl.innerHTML = "";

    const selectedSet = new Set(game.selected);

    for (let i = 0; i < game.rows * game.cols; i += 1) {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.dataset.index = String(i);

        const isSelected = selectedSet.has(i);
        const checkpointNum = game.checkpoints.get(i);

        tile.className = [
            "relative aspect-square rounded-lg border text-sm font-bold transition",
            isSelected
                ? "border-slate-700 bg-slate-700 text-emerald-100"
                : "border-slate-700 bg-slate-800 text-slate-500",
            checkpointNum ? "ring-1 ring-indigo-300/50" : "",
        ].join(" ");

        if (isSelected) {
            const connectorLayer = document.createElement("div");
            connectorLayer.className = "pointer-events-none absolute inset-0";

            const selectedIndex = game.selected.indexOf(i);
            const prevCell = selectedIndex > 0 ? game.selected[selectedIndex - 1] : null;
            const nextCell = selectedIndex < game.selected.length - 1 ? game.selected[selectedIndex + 1] : null;

            const centerDot = document.createElement("div");
            centerDot.className = "absolute h-2.5 w-2.5 rounded-full bg-blue-400";
            centerDot.style.left = "50%";
            centerDot.style.top = "50%";
            centerDot.style.transform = "translate(-50%, -50%)";
            connectorLayer.appendChild(centerDot);

            if (prevCell !== null) {
                connectorLayer.appendChild(createSegment(i, prevCell));
            }
            if (nextCell !== null) {
                connectorLayer.appendChild(createSegment(i, nextCell));
            }

            tile.appendChild(connectorLayer);
        }

        if (checkpointNum) {
            const badge = document.createElement("span");
            badge.className = [
                "absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs",
                isSelected ? "bg-slate-950 text-emerald-300" : "bg-indigo-400 text-slate-950",
            ].join(" ");
            badge.textContent = String(checkpointNum);
            tile.appendChild(badge);
        }

        boardEl.appendChild(tile);
    }
    updateHud();
}

function createSegment(fromCell, toCell) {
    const fromRow = Math.floor(fromCell / game.cols);
    const fromCol = fromCell % game.cols;
    const toRow = Math.floor(toCell / game.cols);
    const toCol = toCell % game.cols;

    const dr = toRow - fromRow;
    const dc = toCol - fromCol;

    const seg = document.createElement("div");
    seg.className = "absolute bg-blue-400";

    if (dc === 1) {
        seg.style.left = "50%";
        seg.style.top = "calc(50% - 2px)";
        seg.style.width = "50%";
        seg.style.height = "4px";
    } else if (dc === -1) {
        seg.style.left = "0";
        seg.style.top = "calc(50% - 2px)";
        seg.style.width = "50%";
        seg.style.height = "4px";
    } else if (dr === 1) {
        seg.style.left = "calc(50% - 2px)";
        seg.style.top = "50%";
        seg.style.width = "4px";
        seg.style.height = "50%";
    } else if (dr === -1) {
        seg.style.left = "calc(50% - 2px)";
        seg.style.top = "0";
        seg.style.width = "4px";
        seg.style.height = "50%";
    }

    return seg;
}

function updateHud() {
    levelLabelEl.textContent = String(game.level);
    const progress = Math.floor((game.selected.length / game.path.length) * 100);
    progressLabelEl.textContent = `${progress}%`;

    const reached = currentReachedCheckpoint();
    checkpointLabelEl.textContent = `${Math.max(reached, 1)} / ${game.checkpointByNumber.size}`;
}

function hasAscendingCheckpointOrder() {
    const seenCheckpointNumbers = [];
    for (const cell of game.selected) {
        const checkpointNum = game.checkpoints.get(cell);
        if (checkpointNum) {
            seenCheckpointNumbers.push(checkpointNum);
        }
    }

    if (seenCheckpointNumbers.length !== game.checkpointByNumber.size) {
        return false;
    }

    for (let i = 0; i < seenCheckpointNumbers.length; i += 1) {
        if (seenCheckpointNumbers[i] !== i + 1) {
            return false;
        }
    }

    return true;
}

function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.className = `mt-3 text-center text-sm font-medium ${isError ? "text-rose-300" : "text-emerald-300"}`;
}

function tryAppendCell(cell) {
    if (game.selected.length === game.path.length) return;

    if (game.selected.length === 0) {
        if (cell !== game.path[0]) {
            return;
        }
        game.selected.push(cell);
        setStatus("Great! Keep swiping to checkpoint 2.");
        renderBoard();
        return;
    }

    const last = game.selected[game.selected.length - 1];

    if (!isNeighbor(last, cell, game.cols)) return;
    if (game.selected.includes(cell)) {
        return;
    }

    game.selected.push(cell);
    const checkpointNum = game.checkpoints.get(cell);
    if (checkpointNum) {
        setStatus(`Checkpoint ${checkpointNum} reached!`);
    } else {
        setStatus("Nice move. Keep going.");
    }

    if (game.selected.length === game.path.length) {
        const lastCell = game.selected[game.selected.length - 1];
        const endsOnNumberedNode = game.checkpoints.has(lastCell);
        const solved = hasAscendingCheckpointOrder() && endsOnNumberedNode;
        if (solved) {
            setStatus("Perfect! Canvas filled. Loading next level...");
            renderBoard();
            window.setTimeout(() => {
                game.level += 1;
                startLevel({ keepLevel: true });
            }, 850);
            return;
        }

        setStatus("Path filled. End on a numbered node and keep ascending order.");
        renderBoard();
        return;
    }

    renderBoard();
}

function tryUndoToCheckpoint(cell) {
    const checkpointNum = game.checkpoints.get(cell);
    if (!checkpointNum) return false;

    const reachedIndex = game.selected.indexOf(cell);
    if (reachedIndex < 0) return false;

    game.selected = game.selected.slice(0, reachedIndex + 1);
    setStatus(`Undone to checkpoint ${checkpointNum}.`);
    renderBoard();
    return true;
}

function cellFromEvent(event) {
    const target = document.elementFromPoint(event.clientX, event.clientY);
    const tile = target?.closest("button[data-index]");
    if (!tile || !boardEl.contains(tile)) return null;
    return Number(tile.dataset.index);
}

function onPointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const cell = cellFromEvent(event);
    if (cell === null) return;

    event.preventDefault();
    game.dragging = true;
    game.pointerId = event.pointerId;

    if (tryUndoToCheckpoint(cell)) return;
    tryAppendCell(cell);
}

function onPointerMove(event) {
    if (!game.dragging || event.pointerId !== game.pointerId) return;
    const cell = cellFromEvent(event);
    if (cell === null) return;

    if (game.selected[game.selected.length - 1] === cell) return;

    if (tryUndoToCheckpoint(cell)) return;
    tryAppendCell(cell);
}

function stopDragging(event) {
    if (event.pointerId && event.pointerId !== game.pointerId) return;
    game.dragging = false;
    game.pointerId = null;
}

function startLevel({ keepLevel = false, randomPattern = true } = {}) {
    const levelConfig = LEVELS[(game.level - 1) % LEVELS.length];
    game.rows = levelConfig.rows;
    game.cols = levelConfig.cols;

    let path = null;
    if (randomPattern) {
        path = generateHamiltonianPath(game.rows, game.cols);
    } else if (game.path.length === game.rows * game.cols) {
        path = [...game.path];
    }

    if (!path) {
        path = generateHamiltonianPath(game.rows, game.cols);
    }

    if (!path) {
        const total = game.rows * game.cols;
        path = Array.from({ length: total }, (_, i) => i);
    }

    game.path = path;
    game.selected = [];

    const { checkpoints, checkpointByNumber } = buildCheckpoints(path, levelConfig.checkpoints);
    game.checkpoints = checkpoints;
    game.checkpointByNumber = checkpointByNumber;

    setStatus("Find checkpoint 1 to start.");
    renderBoard();
}

newPatternBtn.addEventListener("click", () => {
    setStatus("Generating a new random pattern...");
    startLevel({ keepLevel: true, randomPattern: true });
});

restartLevelBtn.addEventListener("click", () => {
    setStatus("Restarted current level.");
    startLevel({ keepLevel: true, randomPattern: false });
});

boardEl.addEventListener("pointerdown", onPointerDown);
boardEl.addEventListener("pointermove", onPointerMove);
boardEl.addEventListener("pointerup", stopDragging);
boardEl.addEventListener("pointercancel", stopDragging);
boardEl.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "touch") stopDragging(event);
});

startLevel();

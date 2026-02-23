const gridSize = 8;
const totalWords = 5;

/* ===============================
   CATEGORIES
================================ */
const categories = {
  Fruits: [
    "apple","banana","mango","grape","kiwi","lemon","plum","pear",
    "peach","papaya","guava","orange","fig","melon"
  ],

  Animals: [
    "tiger","zebra","eagle","horse","shark","koala","panda","fox",
    "wolf","otter","camel","rhino","falcon","monkey"
  ],

  Countries: [
    "india","china","france","italy","egypt","spain","japan","kenya",
    "nepal","brazil","canada","turkey","mexico","greece"
  ],

  Technology: [
    "python","server","router","script","binary","coding",
    "docker","linux","kernel","socket","thread","cache"
  ],

  AI: [
    "model","prompt","token","vector","agent","dataset",
    "neuron","tensor","policy","reward","encoder","decoder"
  ],

  Programming: [
    "python","java","golang","kotlin","ruby","swift",
    "arrays","string","object","method","class","loop"
  ],

  Web: [
    "html","css","react","node","redux","tailwind",
    "browser","cookie","session","api","fetch","json"
  ],

  Databases: [
    "mysql","mongo","redis","sqlite","index","schema",
    "table","column","query","cursor","record"
  ],

  Cloud: [
    "aws","azure","gcp","lambda","docker","kube",
    "server","region","bucket","scaling","backup"
  ],

  DevOps: [
    "git","github","docker","jenkins","ci","cd",
    "deploy","build","branch","commit","merge"
  ],

  Space: [
    "planet","rocket","comet","meteor","saturn",
    "venus","earth","orbit","galaxy","nebula","apollo"
  ],

  Sports: [
    "cricket","soccer","tennis","boxing","hockey",
    "golf","rugby","karate","judo","cycling"
  ]
};


/* ===============================
   STATE
================================ */
let currentCategory = "";
let currentWords = [];
let foundWords = new Set();
let placedWords = [];

const gridElement = document.getElementById("grid");
const hintsElement = document.getElementById("hints");
const victoryElement = document.getElementById("victory");
const categoryElement = document.getElementById("category");

/* ===============================
   INIT GAME (CATEGORY ROTATES)
================================ */
function initGame() {
  gridElement.innerHTML = "";
  hintsElement.innerHTML = "";
  victoryElement.classList.add("hidden");

  foundWords.clear();
  placedWords = [];

  const categoryNames = Object.keys(categories);
  currentCategory =
    categoryNames[Math.floor(Math.random() * categoryNames.length)];

  currentWords = [...categories[currentCategory]]
    .sort(() => 0.5 - Math.random())
    .slice(0, totalWords);

  const grid = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill("")
  );

  // first word
  placedWords.push(placeWordRandom(grid, currentWords[0]));

  // overlapping words
  for (let i = 1; i < currentWords.length; i++) {
    placedWords.push(
      placeWordWithSafeOverlap(grid, currentWords[i], placedWords) ||
      placeWordRandom(grid, currentWords[i])
    );
  }

  // fill grid
  for (let y = 0; y < gridSize; y++)
    for (let x = 0; x < gridSize; x++)
      if (!grid[y][x]) grid[y][x] = randomLetter();

  // render grid
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const d = document.createElement("div");
      d.className =
        "w-10 h-10 bg-gray-700 hover:bg-gray-600 flex items-center justify-center cursor-pointer select-none";
      d.textContent = grid[y][x];
      d.dataset.x = x;
      d.dataset.y = y;
      d.dataset.letter = grid[y][x];
      gridElement.appendChild(d);
    }
  }

  categoryElement.textContent = `Category: ${currentCategory}`;

  currentWords.forEach((w, i) => {
    const li = document.createElement("li");
    li.id = `hint-${w}`;
    li.textContent = `Word ${i + 1}: ${w.length} letters`;
    hintsElement.appendChild(li);
  });

  attachGridEvents();
}

/* ===============================
   HELPERS
================================ */
function randomLetter() {
  const f = "eeeeaaarrttiiionnscldugpmhbyfvkwzxqj";
  return f[Math.floor(Math.random() * f.length)].toUpperCase();
}
const rand = n => Math.floor(Math.random() * n);

/* ===============================
   PLACEMENT
================================ */
function placeWordRandom(grid, word) {
  const dirs = [[1,0],[0,1]];
  const letters = word.toUpperCase().split("");

  while (true) {
    const x = rand(gridSize);
    const y = rand(gridSize);
    const [dx, dy] = dirs[rand(dirs.length)];

    let ok = true;
    for (let i = 0; i < letters.length; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;
      if (
        nx < 0 || ny < 0 ||
        nx >= gridSize || ny >= gridSize ||
        (grid[ny][nx] && grid[ny][nx] !== letters[i])
      ) {
        ok = false;
        break;
      }
    }

    if (ok) {
      for (let i = 0; i < letters.length; i++)
        grid[y + dy * i][x + dx * i] = letters[i];
      return { word: letters.join(""), x, y, dx, dy };
    }
  }
}

function placeWordWithSafeOverlap(grid, word, placedWords) {
  const letters = word.toUpperCase().split("");

  for (const placed of placedWords) {
    for (let i = 0; i < letters.length; i++) {
      for (let j = 0; j < placed.word.length; j++) {
        if (letters[i] !== placed.word[j]) continue;

        const { dx, dy } = placed;
        const startX = placed.x + dx * j - dx * i;
        const startY = placed.y + dy * j - dy * i;

        let ok = true;
        for (let k = 0; k < letters.length; k++) {
          const nx = startX + dx * k;
          const ny = startY + dy * k;
          if (
            nx < 0 || ny < 0 ||
            nx >= gridSize || ny >= gridSize ||
            (grid[ny][nx] && grid[ny][nx] !== letters[k])
          ) {
            ok = false;
            break;
          }
        }

        if (ok) {
          for (let k = 0; k < letters.length; k++)
            grid[startY + dy * k][startX + dx * k] = letters[k];
          return { word: letters.join(""), x: startX, y: startY, dx, dy };
        }
      }
    }
  }
  return null;
}

/* ===============================
   SELECTION (OVERLAP SAFE)
================================ */
let selected = [];
let locked = false;
let stepX = 0, stepY = 0;

function attachGridEvents() {
  document.querySelectorAll("#grid div").forEach(cell => {
    cell.onclick = () => {
      const x = +cell.dataset.x;
      const y = +cell.dataset.y;

      if (selected.some(c => c.x === x && c.y === y)) return;

      if (!selected.length) {
        selected.push({ x, y, letter: cell.textContent });
        cell.classList.add("bg-blue-500");
        return;
      }

      if (!locked) {
        stepX = x - selected[0].x;
        stepY = y - selected[0].y;
        locked = true;
      }

      const last = selected[selected.length - 1];
      if (x === last.x + stepX && y === last.y + stepY) {
        selected.push({ x, y, letter: cell.textContent });
        cell.classList.add("bg-blue-500");
        checkWord();
      }
    };
  });
}

function checkWord() {
  const word = selected.map(c => c.letter).join("").toLowerCase();

  if (!currentWords.includes(word) || foundWords.has(word)) return;

  foundWords.add(word);
  selected.forEach(c => {
    document
      .querySelector(`[data-x="${c.x}"][data-y="${c.y}"]`)
      .classList.replace("bg-blue-500","bg-green-500");
  });

  document.getElementById(`hint-${word}`).textContent += " ✅";
  selected = [];
  locked = false;

  if (foundWords.size === totalWords) {
    victoryElement.classList.remove("hidden");
    setTimeout(initGame, 3000); // 🔁 category rotates
  }
}

/* ===============================
   START
================================ */
initGame();
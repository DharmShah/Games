  const gridSize = 8;
  const totalWords = 5;

  const categories = {
    "Fruits": [
      "apple", "banana", "mango", "grape", "kiwi", "lemon", "plum", "cherry", "fig", "pear",
      "orange", "guava", "apricot", "avocado", "blueberry", "coconut", "date", "lychee", "papaya", "raspberry"
    ],
    "Animals": [
      "tiger", "zebra", "eagle", "horse", "shark", "koala", "rhino", "panda", "lemur", "fox",
      "wolf", "lion", "giraffe", "camel", "whale", "otter", "sloth", "duck", "goose", "falcon"
    ],
    "Cars": [
      "tesla", "audi", "bmw", "tata", "jeep", "ford", "honda", "nissan", "fiat", "hyundai",
      "kia", "volvo", "lexus", "mazda", "toyota", "porsche", "ferrari", "lamborghini", "jaguar", "bugatti"
    ],
    "Countries": [
      "india", "china", "france", "italy", "egypt", "brazil", "canada", "spain", "japan", "kenya",
      "nepal", "turkey", "mexico", "germany", "sweden", "norway", "russia", "argentina", "poland", "vietnam"
    ],
    "Colors": [
      "green", "purple", "orange", "yellow", "brown", "white", "black", "indigo", "violet", "cyan",
      "beige", "teal", "pink", "gray", "maroon", "navy", "silver", "gold", "red", "blue"
    ],
    "Sports": [
      "cricket", "soccer", "tennis", "boxing", "hockey", "rugby", "karate", "archery", "cycling", "golf",
      "rowing", "skiing", "skating", "surfing", "baseball", "handball", "fencing", "judo", "wrestling", "badminton"
    ],
    "Jobs": [
      "doctor", "engineer", "teacher", "lawyer", "artist", "barber", "baker", "farmer", "pilot", "nurse",
      "driver", "chef", "clerk", "police", "soldier", "writer", "singer", "dancer", "actor", "tailor"
    ],
    "Space": [
      "planet", "rocket", "saturn", "comet", "meteor", "nebula", "galaxy", "orbits", "cosmos", "asteroid",
      "venus", "earth", "jupiter", "uranus", "pluto", "apollo", "nasa", "telescope", "spacesuit", "gravity"
    ],
    "Technology": [
      "laptop", "mobile", "server", "router", "sensor", "camera", "screen", "monitor", "cable", "modem",
      "socket", "script", "python", "javascript", "binary", "coding", "driver", "plugin", "android", "iphone"
    ]
  }


  let usedWords = new Set();
  let currentWords = [];
  let currentCategory = "";
  let foundWords = [];

  const gridElement = document.getElementById("grid");
  const hintsElement = document.getElementById("hints");
  const victoryElement = document.getElementById("victory");
  const categoryElement = document.getElementById("category");
  const showWordsBtn = document.getElementById("showWordsBtn");

  function initGame() {
    gridElement.innerHTML = "";
    hintsElement.innerHTML = "";
    victoryElement.classList.add("hidden");
    foundWords = [];

    const categoryNames = Object.keys(categories);
    currentCategory = categoryNames[Math.floor(Math.random() * categoryNames.length)];
    const wordPool = categories[currentCategory].filter(w => !usedWords.has(w));

    currentWords = [];
    const shuffled = wordPool.sort(() => 0.5 - Math.random());
    for (let i = 0; i < totalWords; i++) {
      const word = shuffled[i];
      currentWords.push(word);
      usedWords.add(word);
    }

    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
    currentWords.forEach(word => placeWordInGrid(grid, word));

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (!grid[y][x]) grid[y][x] = randomLetter();
      }
    }

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const div = document.createElement("div");
        div.className = "w-10 h-10 bg-gray-700 hover:bg-gray-600 flex items-center justify-center cursor-pointer select-none";
        div.textContent = grid[y][x];
        div.dataset.letter = grid[y][x];
        div.dataset.x = x;
        div.dataset.y = y;
        gridElement.appendChild(div);
      }
    }

    categoryElement.textContent = `Category: ${currentCategory}`;
    currentWords.forEach((word, i) => {
      const li = document.createElement("li");
      li.id = `hint-${word}`;
      li.textContent = `Word ${i + 1}: ${word.length} letters`;
      hintsElement.appendChild(li);
    });

    attachGridEvents();
  }

  function randomLetter() {
    const freq = "eeeeaaarrttiiionnscldugpmhbyfvkwzxqj";
    return freq[Math.floor(Math.random() * freq.length)].toUpperCase();
  }

  function placeWordInGrid(grid, word) {
    const directions = [
      [0, 1], [1, 0], [1, 1], [-1, 1],
      [0, -1], [-1, 0], [-1, -1], [1, -1]
    ];
    const chars = word.toUpperCase().split("");
    let placed = false;

    while (!placed) {
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);
      const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
      let ok = true;

      for (let i = 0; i < chars.length; i++) {
        const nx = x + dx * i;
        const ny = y + dy * i;
        if (nx < 0 || ny < 0 || nx >= gridSize || ny >= gridSize) {
          ok = false;
          break;
        }
        const cell = grid[ny][nx];
        if (cell && cell !== chars[i]) {
          ok = false;
          break;
        }
      }

      if (ok) {
        for (let i = 0; i < chars.length; i++) {
          const nx = x + dx * i;
          const ny = y + dy * i;
          grid[ny][nx] = chars[i];
        }
        placed = true;
      }
    }
  }

  let selectedCells = [];
  let directionLocked = false;
  let stepX = 0;
  let stepY = 0;

  function attachGridEvents() {
    const cells = document.querySelectorAll("#grid > div");
    cells.forEach(cell => {
      cell.addEventListener("click", () => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        const key = `${x},${y}`;

        if (selectedCells.some(c => c.key === key)) return;

        const newCell = { letter: cell.dataset.letter, x, y, key };

        if (selectedCells.length === 0) {
          selectedCells.push(newCell);
          cell.classList.add("bg-blue-500");
        } else {
          if (!directionLocked && selectedCells.length === 1) {
            stepX = x - selectedCells[0].x;
            stepY = y - selectedCells[0].y;
            directionLocked = true;
            selectedCells.push(newCell);
            cell.classList.add("bg-blue-500");
          } else if (directionLocked) {
            const last = selectedCells[selectedCells.length - 1];
            if (x === last.x + stepX && y === last.y + stepY) {
              selectedCells.push(newCell);
              cell.classList.add("bg-blue-500");
            }
          }
        }

        checkWord();
      });
    });

    let showWordsToggle = false;
    showWordsBtn.addEventListener("click", () => {
      showWordsToggle = !showWordsToggle;
      if (showWordsToggle) {
        highlightAllWords();
        showWordsBtn.textContent = "Hide Words";
      } else {
        clearHighlights();
        showWordsBtn.textContent = "Show Words";
      }
    });
  }

  function checkWord() {
    const current = selectedCells.map(c => c.letter).join("").toLowerCase();

    if (currentWords.includes(current) && !foundWords.includes(current)) {
      foundWords.push(current);
      selectedCells.forEach(c => {
        const el = document.querySelector(`[data-x="${c.x}"][data-y="${c.y}"]`);
        el.classList.remove("bg-blue-500");
        el.classList.add("bg-green-500");
      });
      document.getElementById(`hint-${current}`).textContent += " ✅";
      selectedCells = [];
      directionLocked = false;

      if (foundWords.length === totalWords) {
        victoryElement.classList.remove("hidden");
        setTimeout(initGame, 3000);
      }

    } else if (!currentWords.some(word => word.startsWith(current))) {
      selectedCells.forEach(c => {
        const el = document.querySelector(`[data-x="${c.x}"][data-y="${c.y}"]`);
        el.classList.remove("bg-blue-500");
        el.classList.add("bg-red-500");
      });
      setTimeout(() => {
        selectedCells.forEach(c => {
          const el = document.querySelector(`[data-x="${c.x}"][data-y="${c.y}"]`);
          el.classList.remove("bg-red-500");
        });
        selectedCells = [];
        directionLocked = false;
      }, 500);
    }
  }

  function highlightAllWords() {
    const cells = document.querySelectorAll("#grid > div");
    currentWords.forEach(word => {
      const w = word.toUpperCase();
      const letters = w.split("");

      for (let cell of cells) {
        if (cell.textContent === letters[0]) {
          const x = parseInt(cell.dataset.x);
          const y = parseInt(cell.dataset.y);
          for (let dir of [
            [0, 1], [1, 0], [1, 1], [-1, 1],
            [0, -1], [-1, 0], [-1, -1], [1, -1]
          ]) {
            const match = [];
            for (let i = 0; i < letters.length; i++) {
              const nx = x + dir[0] * i;
              const ny = y + dir[1] * i;
              const el = document.querySelector(`[data-x="${nx}"][data-y="${ny}"]`);
              if (!el || el.textContent !== letters[i]) break;
              match.push(el);
            }
            if (match.length === letters.length) {
              match.forEach(el => el.classList.add("bg-yellow-500"));
              break;
            }
          }
        }
      }
    });
  }

  function clearHighlights() {
    const cells = document.querySelectorAll("#grid > div");
    cells.forEach(cell => cell.classList.remove("bg-yellow-500"));
  }

  initGame();

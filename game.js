// game.js

let level = 1;
let questions = [];
let currentInput = [];
let focusedIndex = 0;
let showAnswer = false;
let activeBox = null;

const levelDisplay = document.getElementById("level");
const topicDisplay = document.getElementById("topic");
const questionDisplay = document.getElementById("question");
const hintDisplay = document.getElementById("hint");
const blanks = document.getElementById("blanks");
const feedbackDisplay = document.getElementById("feedback");
const submitBtn = document.getElementById("submit-btn");
const toggleAnswerBtn = document.getElementById("toggle-answer-btn");

const savedLevel = sessionStorage.getItem("currentLevel");
if (savedLevel) level = parseInt(savedLevel);

async function loadQuestions() {
  const res = await fetch("questions-html-css.json");
  questions = await res.json();
  showQuestion();
}

function renderBlanks(answer) {
  blanks.innerHTML = "";
  currentInput = Array(answer.length).fill("");
  answer.split("").forEach((char, i) => {
    const input = document.createElement("input");
    input.className = "char-box";
    input.setAttribute("maxlength", 1);
    input.dataset.index = i;
    input.value = char === " " ? " " : "";
    input.readOnly = char === " ";

    input.addEventListener("focus", () => {
      focusedIndex = i;
      activeBox = input;
    });

    input.addEventListener("input", (e) => {
      const val = e.target.value;
      if (val.length > 0) {
        currentInput[i] = val;
        const next = blanks.querySelector(`[data-index='${i + 1}']`);
        if (next) next.focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace") {
        currentInput[i] = "";
        input.value = "";
        const prev = blanks.querySelector(`[data-index='${i - 1}']`);
        if (prev) prev.focus();
      } else if (e.key === "ArrowLeft") {
        const prev = blanks.querySelector(`[data-index='${i - 1}']`);
        if (prev) prev.focus();
      } else if (e.key === "ArrowRight") {
        const next = blanks.querySelector(`[data-index='${i + 1}']`);
        if (next) next.focus();
      }
    });

    blanks.appendChild(input);
  });
  blanks.querySelector("input:not([readonly])")?.focus();
}

function updateBlanks() {
  const inputs = blanks.querySelectorAll(".char-box");
  const current = questions.find(q => q.level === level);

  inputs.forEach((input, i) => {
    if (showAnswer) {
      input.value = current.answer[i];
      input.readOnly = true;
    } else {
      input.value = currentInput[i];
      input.readOnly = current.answer[i] === " ";
    }
  });
}

function checkAnswer() {
  if (showAnswer) return;

  const current = questions.find(q => q.level === level);
  const userAnswer = currentInput.join("").replace(/\s+/g, "").toLowerCase();
  const correctAnswer = current.answer.replace(/\s+/g, "").toLowerCase();

  if (userAnswer === correctAnswer) {
    feedbackDisplay.textContent = "✅ Correct! Moving to next level...";
    feedbackDisplay.className = "text-green-400 font-bold";
    level++;
    sessionStorage.setItem("currentLevel", level);
    toggleAnswerBtn.classList.add("hidden");
    setTimeout(showQuestion, 1500);
  } else {
    feedbackDisplay.textContent = "❌ Incorrect. Try again or view answer.";
    feedbackDisplay.className = "text-red-400 font-bold";
    toggleAnswerBtn.classList.remove("hidden");
  }
}

function showQuestion() {
  const current = questions.find(q => q.level === level);
  if (!current) {
    questionDisplay.textContent = "🎉 You’ve completed all levels!";
    hintDisplay.textContent = "";
    blanks.innerHTML = "";
    submitBtn.disabled = true;
    toggleAnswerBtn.classList.add("hidden");
    return;
  }

  levelDisplay.textContent = current.level;
  topicDisplay.textContent = current.topic;
  questionDisplay.textContent = current.question;
  hintDisplay.textContent = `💡 Hint: ${current.hint}`;
  feedbackDisplay.textContent = "";
  showAnswer = false;
  toggleAnswerBtn.textContent = "Show Answer";
  toggleAnswerBtn.classList.add("hidden");
  submitBtn.disabled = false;

  renderBlanks(current.answer);
  updateBlanks();
}

document.addEventListener("paste", (e) => {
  const paste = (e.clipboardData || window.clipboardData).getData("text");
  const chars = paste.split("");
  const inputs = blanks.querySelectorAll(".char-box");
  chars.forEach((char, i) => {
    if (i < inputs.length && !inputs[i].readOnly) {
      inputs[i].value = char;
      currentInput[i] = char;
    }
  });
  const next = blanks.querySelector(`[data-index='${chars.length}']`);
  if (next) next.focus();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("helper-btn")) {
    if (!activeBox) return;

    const insertText = e.target.innerText;
    const start = activeBox.selectionStart || 0;
    const end = activeBox.selectionEnd || 0;
    const original = activeBox.value || "";
    const newValue = original.slice(0, start) + insertText + original.slice(end);

    activeBox.value = newValue;
    activeBox.setSelectionRange(start + insertText.length, start + insertText.length);

    const allBoxes = Array.from(document.querySelectorAll(".char-box"));
    const currentIndex = allBoxes.indexOf(activeBox);
    currentInput[currentIndex] = newValue;

    const nextBox = allBoxes[currentIndex + 1];
    if (nextBox && !nextBox.readOnly) {
      nextBox.focus();
    }
  }
});

submitBtn.addEventListener("click", checkAnswer);
toggleAnswerBtn.addEventListener("click", () => {
  showAnswer = !showAnswer;
  toggleAnswerBtn.textContent = showAnswer ? "Hide Answer" : "Show Answer";
  updateBlanks();
});

loadQuestions();
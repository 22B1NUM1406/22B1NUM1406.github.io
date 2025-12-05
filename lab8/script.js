const words = [
  { question: "Монгол улсын нийслэл хот", word: "УЛААНБААТАР" },
  { question: "Дэлхийн хамгийн өндөр оргил", word: "ЭВЕРЕСТ" },
  { question: "Монгол үндэсний уламжлалт орон сууц", word: "ГЭР" },
  { question: "Монгол улсын мөнгөний нэгж", word: "ТӨГРӨГ" },
  { question: "Монголын зууны манлай роман", word: "ТУНГАЛАГ ТАМИР" },
  { question: "Зууны манлай уртын дуучин", word: "НОРОВБАНЗАД" },
  { question: "Дэлхийн хамгийн том хөхтөн амьтан", word: "ХАЛИМ" }
];

let currentWord = "";
let currentQuestion = "";
let wrongGuesses = 0;
let revealedIndexes = []; 
const maxWrongGuesses = 6;

const welcomeScreen = document.getElementById("welcome-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const questionElement = document.getElementById("question");
const wordContainer = document.getElementById("word-container");
const lettersContainer = document.getElementById("letters-container");
const hangmanImage = document.getElementById("hangman-image");
const deathText = document.getElementById("death-text");
const correctCountElement = document.getElementById("correct-count");
const wrongCountElement = document.getElementById("wrong-count");


function initGame() {
  revealedIndexes = [];
  wrongGuesses = 0;
  deathText.textContent = "";
  restartBtn.style.display = "none";

  const random = words[Math.floor(Math.random() * words.length)];
  currentWord = random.word;
  currentQuestion = random.question;

  questionElement.textContent = currentQuestion;

  updateWordDisplay();
  createLetterButtons();
  updateHangmanImage();
  updateScoreDisplay();

  welcomeScreen.style.display = "none";
  gameScreen.style.display = "flex";
}


function updateWordDisplay() {
  wordContainer.innerHTML = "";

  for (let i = 0; i < currentWord.length; i++) {
    const box = document.createElement("div");
    box.className = "letter-box";

    if (currentWord[i] === " ") {
      box.innerHTML = "&nbsp;";
      box.style.borderBottom = "none";
      box.style.marginRight = "25px";
    } else if (revealedIndexes.includes(i)) {
      box.textContent = currentWord[i];
    } else {
      box.textContent = "";
    }

    wordContainer.appendChild(box);
  }
}


function createLetterButtons() {
  lettersContainer.innerHTML = "";

  const alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСӨҮТУФХЦЧШЩЪЫЬЭЮЯ";

  alphabet.split("").forEach(letter => {
    const btn = document.createElement("button");
    btn.className = "letter-btn";
    btn.textContent = letter;
    btn.addEventListener("click", () => handleLetterClick(letter));
    lettersContainer.appendChild(btn);
  });
}


function handleLetterClick(letter) {
  if (wrongGuesses >= maxWrongGuesses) return;

  let nextIndex = -1;

  for (let i = 0; i < currentWord.length; i++) {
    if (
      currentWord[i] === letter &&
      !revealedIndexes.includes(i)
    ) {
      nextIndex = i;
      break;
    }
  }

  if (nextIndex === -1) {
    wrongGuesses++;
    updateHangmanImage();
    updateScoreDisplay();
    checkGameStatus();
    return;
  }

  revealedIndexes.push(nextIndex);

  updateWordDisplay();
  updateScoreDisplay();
  checkGameStatus();
}


function updateHangmanImage() {
  const images = [
    "0.png",
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png"
  ];

  hangmanImage.src = images[wrongGuesses] || images[0];
}


function updateScoreDisplay() {
  const correctLettersCount = revealedIndexes.length;
  correctCountElement.textContent = correctLettersCount;
  wrongCountElement.textContent = wrongGuesses;
}


function checkGameStatus() {
  const isWin =
    currentWord.split("").every(
      (letter, index) => letter === " " || revealedIndexes.includes(index)
    );

  if (isWin) {
    deathText.textContent = "Баяр хүргэе! Та хожлоо!";
    deathText.style.color = "#00ff88";
    restartBtn.style.display = "block";
    return;
  }

  if (wrongGuesses >= maxWrongGuesses) {
    deathText.textContent = `Та хожигдлоо! Зөв хариулт: ${currentWord}`;
    deathText.style.color = "#ec5f5fff";
    revealFullWord();
    restartBtn.style.display = "block";
  }
}


function revealFullWord() {
  const boxes = document.querySelectorAll(".letter-box");

  for (let i = 0; i < currentWord.length; i++) {
    if (currentWord[i] !== " ") {
      boxes[i].textContent = currentWord[i];
      boxes[i].style.color = "#ec5f5fff";
    }
  }
}


startBtn.addEventListener("click", initGame);
restartBtn.addEventListener("click", initGame);


window.onload = () => {
  welcomeScreen.style.display = "flex";
  gameScreen.style.display = "none";
};

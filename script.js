let activePlayer = 1;
let playerScores = { 1: 0, 2: 0 };
let wordHistory = { 1: [], 2: [] };
let countdownInterval;
let secondsRemaining = 10;

const getElementById = (id) => document.getElementById(id);

const wordInputs = [getElementById("input1"), getElementById("input2")];
const submitButtons = [getElementById("submit1"), getElementById("submit2")];
const scoreDisplays = [getElementById("score1"), getElementById("score2")];
const timerDisplays = [getElementById("timer1"), getElementById("timer2")];
const feedbackMessages = [getElementById("msg1"), getElementById("msg2")];
const historyLists = [getElementById("history1"), getElementById("history2")];

async function isValidEnglishWord(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );
    return response.ok;
  } catch {
    return false;
  }
}

function rules(word, playerNumber) {
  const opponentNumber = playerNumber === 1 ? 2 : 1;
  const lastOpponentWord = wordHistory[opponentNumber].at(-1) || "";

  return (
    word.length >= 4 &&
    !wordHistory[playerNumber].includes(word) &&
    (!lastOpponentWord || word[0] === lastOpponentWord.slice(-1))
  );
}

function updateScore(playerNumber, changeAmount) {
  playerScores[playerNumber] += changeAmount;
  scoreDisplays[playerNumber - 1].textContent = playerScores[playerNumber];
}

function addWordToHistory(word, playerNumber) {
  wordHistory[playerNumber].push(word);
  const listItem = document.createElement("li");
  listItem.textContent = word;
  historyLists[playerNumber - 1].appendChild(listItem);
}

function toggleActivePlayer() {
  activePlayer = activePlayer === 1 ? 2 : 1;

  wordInputs.forEach(
    (input, index) => (input.disabled = index + 1 !== activePlayer),
  );
  submitButtons.forEach(
    (button, index) => (button.disabled = index + 1 !== activePlayer),
  );
  wordInputs.forEach((input) => (input.value = ""));

  startCountdown();
}

function startCountdown() {
  clearInterval(countdownInterval);
  secondsRemaining = 10;
  updateTimerDisplay();

  countdownInterval = setInterval(() => {
    secondsRemaining--;
    updateTimerDisplay();

    if (secondsRemaining === 0) {
      feedbackMessages[activePlayer - 1].textContent = "Time's up!";
      updateScore(activePlayer, -1);
      toggleActivePlayer();
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerDisplays[0].textContent = activePlayer === 1 ? secondsRemaining : "-";
  timerDisplays[1].textContent = activePlayer === 2 ? secondsRemaining : "-";
}

async function processTurn(playerNumber) {
  feedbackMessages[0].textContent = "";
  feedbackMessages[1].textContent = "";

  const enteredWord = wordInputs[playerNumber - 1].value.trim().toLowerCase();
  if (!enteredWord) return;

  const isWordValid = await isValidEnglishWord(enteredWord);
  const isRulesValid = rules(enteredWord, playerNumber);

  if (!isWordValid || !isRulesValid) {
    feedbackMessages[playerNumber - 1].textContent =
      "Invalid word or rule violation";
    updateScore(playerNumber, -1);
  } else {
    feedbackMessages[playerNumber - 1].textContent = "Accepted!";
    updateScore(playerNumber, 1);
    addWordToHistory(enteredWord, playerNumber);
  }

  toggleActivePlayer();
}

submitButtons[0].addEventListener("click", () => processTurn(1));
submitButtons[1].addEventListener("click", () => processTurn(2));

wordInputs[1].disabled = true;
submitButtons[1].disabled = true;
startCountdown();

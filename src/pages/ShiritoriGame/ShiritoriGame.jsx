import { useState, useEffect } from "react";

function ShiritoriGame() {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [wordHistory, setWordHistory] = useState([]);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [inputWord, setInputWord] = useState("");
  const [timer, setTimer] = useState(20); // seconds per turn

  // Switch player function
  const switchPlayer = () => {
    setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
    setTimer(20); // reset timer for new turn
  };

  // Validate word logic (frontend example)
  const validateWord = (word) => {
    if (word.length < 4) return false; // minimum 4 letters
    if (wordHistory.includes(word.toLowerCase())) return false; // no repeats
    if (wordHistory.length > 0) {
      const lastWord = wordHistory[wordHistory.length - 1];
      if (word[0].toLowerCase() !== lastWord.slice(-1)) return false; // check last letter
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const word = inputWord.trim();
    const isValid = validateWord(word);

    // Update score
    setScores((prev) => ({
      ...prev,
      [`player${currentPlayer}`]:
        prev[`player${currentPlayer}`] + (isValid ? 1 : -1),
    }));

    if (isValid) {
      setWordHistory([...wordHistory, word.toLowerCase()]);
    }

    setInputWord(""); // clear input
    switchPlayer(); // switch player after submission
  };

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          // Time over → subtract point and switch
          setScores((prevScores) => ({
            ...prevScores,
            [`player${currentPlayer}`]:
              prevScores[`player${currentPlayer}`] - 1,
          }));
          switchPlayer();
          return 20; // reset timer for new player
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayer]);

  return (
    <div>
      <h2>Current Player: Player {currentPlayer}</h2>
      <h3>Timer: {timer}s</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          placeholder="Enter your word"
          required
        />
        <button type="submit">Submit</button>
      </form>
      <h3>Scores:</h3>
      <p>Player 1: {scores.player1}</p>
      <p>Player 2: {scores.player2}</p>
      <h3>Word History:</h3>
      <ul>
        {wordHistory.map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
    </div>
  );
}

export default ShiritoriGame;

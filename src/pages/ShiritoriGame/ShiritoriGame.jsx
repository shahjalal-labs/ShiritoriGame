import { useState, useEffect, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";
import { checkWord } from "../../utils/api/dictionary";

function ShiritoriGame() {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [wordHistory, setWordHistory] = useState([]);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [inputWord, setInputWord] = useState("");
  const [timer, setTimer] = useState(20);

  // expected starting letter for the next word
  const expectedLetter = useMemo(() => {
    if (wordHistory.length === 0) return null;
    return wordHistory[wordHistory.length - 1].slice(-1);
  }, [wordHistory]);

  const resetAndSwitch = () => {
    setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
    setTimer(20);
    setInputWord("");
  };

  // simple game-rule checks (no API here)
  const ruleCheck = (word) => {
    if (word.length < 4) {
      toast.error("Word must be at least 4 characters.");
      return false;
    }
    if (wordHistory.includes(word.toLowerCase())) {
      toast.error("This word was already used.");
      return false;
    }
    if (expectedLetter && word[0].toLowerCase() !== expectedLetter) {
      toast.error(
        `Your word must start with "${expectedLetter.toUpperCase()}".`,
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const raw = inputWord.trim();
    if (!raw) return;
    const word = raw.toLowerCase();

    // 1) game rule checks (toast on failure)
    const rulesPass = ruleCheck(word);

    if (!rulesPass) {
      // -1 for invalid rule, switch, reset timer
      setScores((prev) => ({
        ...prev,
        [`player${currentPlayer}`]: prev[`player${currentPlayer}`] - 1,
      }));
      resetAndSwitch();
      return;
    }

    // 2) dictionary API check (swal on failure)
    const dictOK = await checkWord(word);
    if (!dictOK) {
      // -1 for invalid dictionary, switch, reset timer
      setScores((prev) => ({
        ...prev,
        [`player${currentPlayer}`]: prev[`player${currentPlayer}`] - 1,
      }));
      resetAndSwitch();
      return;
    }

    // 3) valid: +1, add to history, switch, reset timer
    setScores((prev) => ({
      ...prev,
      [`player${currentPlayer}`]: prev[`player${currentPlayer}`] + 1,
    }));
    setWordHistory((prev) => [...prev, word]);
    resetAndSwitch();
  };

  // countdown per player
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          // timeout → -1 and switch
          toast.error(`Time's up! Player ${currentPlayer} -1 point.`);
          setScores((prevScores) => ({
            ...prevScores,
            [`player${currentPlayer}`]:
              prevScores[`player${currentPlayer}`] - 1,
          }));
          // switch & reset
          setCurrentPlayer((p) => (p === 1 ? 2 : 1));
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayer]);

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">
        Shiritori Game 🎮
      </h1>

      {/* Top status: timer + expected letter */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <p className="text-lg">
          Now Playing:{" "}
          <span
            className={`font-bold ${
              currentPlayer === 1 ? "text-primary" : "text-secondary"
            }`}
          >
            Player {currentPlayer}
          </span>
        </p>
        <p className="text-lg">
          ⏳ <span className="font-bold">{timer}s</span> left
        </p>
        <p className="text-sm opacity-80">
          Next word must start with:{" "}
          <span className="badge badge-outline badge-lg px-3">
            {expectedLetter
              ? expectedLetter.toUpperCase()
              : "ANY (≥ 4 letters)"}
          </span>
        </p>
        {wordHistory.length > 0 && (
          <p className="text-sm opacity-70">
            Last word:{" "}
            <span className="badge badge-ghost px-3">{wordHistory.at(-1)}</span>
          </p>
        )}
      </div>

      {/* Two Player Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Player 1 */}
        <div
          className={`card bg-base-100 shadow-xl p-6 transition-all ${
            currentPlayer === 1 ? "border-4 border-primary" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Player 1</h2>
            <span className="badge badge-primary">Score: {scores.player1}</span>
          </div>

          <p className="mb-3 text-sm opacity-70">
            Start with:{" "}
            <span className="badge badge-outline">
              {expectedLetter ? expectedLetter.toUpperCase() : "ANY"}
            </span>
          </p>

          {currentPlayer === 1 ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                className="input input-bordered w-full"
                placeholder={
                  expectedLetter
                    ? `Start with "${expectedLetter.toUpperCase()}"`
                    : "Enter any valid English word (≥ 4)"
                }
                autoFocus
                required
              />
              <button className="btn btn-primary">Submit</button>
            </form>
          ) : (
            <p className="text-gray-400 italic">Waiting for turn...</p>
          )}
        </div>

        {/* Player 2 */}
        <div
          className={`card bg-base-100 shadow-xl p-6 transition-all ${
            currentPlayer === 2 ? "border-4 border-secondary" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">Player 2</h2>
            <span className="badge badge-secondary">
              Score: {scores.player2}
            </span>
          </div>

          <p className="mb-3 text-sm opacity-70">
            Start with:{" "}
            <span className="badge badge-outline">
              {expectedLetter ? expectedLetter.toUpperCase() : "ANY"}
            </span>
          </p>

          {currentPlayer === 2 ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                className="input input-bordered w-full"
                placeholder={
                  expectedLetter
                    ? `Start with "${expectedLetter.toUpperCase()}"`
                    : "Enter any valid English word (≥ 4)"
                }
                autoFocus
                required
              />
              <button className="btn btn-secondary">Submit</button>
            </form>
          ) : (
            <p className="text-gray-400 italic">Waiting for turn...</p>
          )}
        </div>
      </div>

      {/* Word History */}
      <div className="card bg-base-100 shadow-xl p-6">
        <h3 className="text-xl font-bold mb-3">Word History</h3>
        {wordHistory.length === 0 ? (
          <p className="italic text-gray-400">No words yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {wordHistory.map((w, i) => (
              <span key={i} className="badge badge-outline badge-lg px-4 py-2">
                {w}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShiritoriGame;

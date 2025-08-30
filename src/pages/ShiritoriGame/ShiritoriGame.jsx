// import { useState, useEffect } from "react";
// import { checkWord } from "../../utils/api/dictionary";
//
// function ShiritoriGame() {
//   const [currentPlayer, setCurrentPlayer] = useState(1);
//   const [wordHistory, setWordHistory] = useState([]);
//   const [scores, setScores] = useState({ player1: 0, player2: 0 });
//   const [inputWord, setInputWord] = useState("");
//   const [timer, setTimer] = useState(20);
//
//   // Switch player
//   const switchPlayer = () => {
//     setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
//     setTimer(20);
//   };
//
//   // Word validation
//   const validateWord = (word) => {
//     if (word.length < 4) return false;
//     if (wordHistory.includes(word.toLowerCase())) return false;
//     if (wordHistory.length > 0) {
//       const lastWord = wordHistory[wordHistory.length - 1];
//       if (word[0].toLowerCase() !== lastWord.slice(-1)) return false;
//     }
//     return true;
//   };
//
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const word = inputWord.trim();
//     const isValid = validateWord(word);
//
//     setScores((prev) => ({
//       ...prev,
//       [`player${currentPlayer}`]:
//         prev[`player${currentPlayer}`] + (isValid ? 1 : -1),
//     }));
//
//     if (isValid) {
//       setWordHistory([...wordHistory, word.toLowerCase()]);
//     }
//
//     setInputWord("");
//     switchPlayer();
//   };
//
//   // Timer countdown
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimer((prev) => {
//         if (prev === 1) {
//           setScores((prevScores) => ({
//             ...prevScores,
//             [`player${currentPlayer}`]:
//               prevScores[`player${currentPlayer}`] - 1,
//           }));
//           switchPlayer();
//           return 20;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//
//     return () => clearInterval(interval);
//   }, [currentPlayer]);
//
//   return (
//     <div className="min-h-screen bg-base-200 p-6">
//       <h1 className="text-3xl font-bold text-center mb-6 text-primary">
//         Shiritori Game 🎮
//       </h1>
//
//       {/* Two Player Columns */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         {/* Player 1 */}
//         <div
//           className={`card shadow-xl p-6 ${
//             currentPlayer === 1 ? "border-4 border-primary" : ""
//           }`}
//         >
//           <h2 className="text-xl font-bold mb-2 flex justify-between">
//             Player 1{" "}
//             <span className="badge badge-primary">Score: {scores.player1}</span>
//           </h2>
//
//           {currentPlayer === 1 ? (
//             <form onSubmit={handleSubmit} className="flex gap-2">
//               <input
//                 type="text"
//                 value={inputWord}
//                 onChange={(e) => setInputWord(e.target.value)}
//                 className="input input-bordered w-full"
//                 placeholder="Enter your word"
//                 required
//               />
//               <button className="btn btn-primary">Submit</button>
//             </form>
//           ) : (
//             <p className="text-gray-400 italic">Waiting for turn...</p>
//           )}
//         </div>
//
//         {/* Player 2 */}
//         <div
//           className={`card shadow-xl p-6 ${
//             currentPlayer === 2 ? "border-4 border-secondary" : ""
//           }`}
//         >
//           <h2 className="text-xl font-bold mb-2 flex justify-between">
//             Player 2{" "}
//             <span className="badge badge-secondary">
//               Score: {scores.player2}
//             </span>
//           </h2>
//
//           {currentPlayer === 2 ? (
//             <form onSubmit={handleSubmit} className="flex gap-2">
//               <input
//                 type="text"
//                 value={inputWord}
//                 onChange={(e) => setInputWord(e.target.value)}
//                 className="input input-bordered w-full"
//                 placeholder="Enter your word"
//                 required
//               />
//               <button className="btn btn-secondary">Submit</button>
//             </form>
//           ) : (
//             <p className="text-gray-400 italic">Waiting for turn...</p>
//           )}
//         </div>
//       </div>
//
//       {/* Timer */}
//       <div className="text-center mb-6">
//         <p className="text-lg">
//           ⏳ <span className="font-bold">{timer}s</span> left for Player{" "}
//           {currentPlayer}
//         </p>
//       </div>
//
//       {/* Word History */}
//       <div className="card bg-base-100 shadow-xl p-6">
//         <h3 className="text-xl font-bold mb-3">Word History</h3>
//         {wordHistory.length === 0 ? (
//           <p className="italic text-gray-400">No words yet</p>
//         ) : (
//           <div className="flex flex-wrap gap-2">
//             {wordHistory.map((w, i) => (
//               <span key={i} className="badge badge-outline badge-lg px-4 py-2">
//                 {w}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
//
// export default ShiritoriGame;

import { useState, useEffect } from "react";
import { checkWord } from "../../utils/api/dictionary";

function ShiritoriGame() {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [wordHistory, setWordHistory] = useState([]);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [inputWord, setInputWord] = useState("");
  const [timer, setTimer] = useState(20);

  // Switch player
  const switchPlayer = () => {
    setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
    setTimer(20);
  };

  // Game rule validation
  const validateWord = (word) => {
    if (word.length < 4) return false;
    if (wordHistory.includes(word.toLowerCase())) return false;
    if (wordHistory.length > 0) {
      const lastWord = wordHistory[wordHistory.length - 1];
      if (word[0].toLowerCase() !== lastWord.slice(-1)) return false;
    }
    return true;
  };

  // Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const word = inputWord.trim().toLowerCase();

    // ✅ First check with dictionary API
    const isDictionaryValid = await checkWord(word);
    if (!isDictionaryValid) {
      setInputWord("");
      return; // stop if not a valid English word
    }

    // ✅ Then check Shiritori game rules
    const isGameValid = validateWord(word);

    setScores((prev) => ({
      ...prev,
      [`player${currentPlayer}`]:
        prev[`player${currentPlayer}`] + (isGameValid ? 1 : -1),
    }));

    if (isGameValid) {
      setWordHistory([...wordHistory, word]);
    }

    setInputWord("");
    switchPlayer();
  };

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          // time up → penalty
          setScores((prevScores) => ({
            ...prevScores,
            [`player${currentPlayer}`]:
              prevScores[`player${currentPlayer}`] - 1,
          }));
          switchPlayer();
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayer]);

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">
        Shiritori Game 🎮
      </h1>

      {/* Two Player Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Player 1 */}
        <div
          className={`card shadow-xl p-6 ${
            currentPlayer === 1 ? "border-4 border-primary" : ""
          }`}
        >
          <h2 className="text-xl font-bold mb-2 flex justify-between">
            Player 1{" "}
            <span className="badge badge-primary">Score: {scores.player1}</span>
          </h2>

          {currentPlayer === 1 ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter your word"
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
          className={`card shadow-xl p-6 ${
            currentPlayer === 2 ? "border-4 border-secondary" : ""
          }`}
        >
          <h2 className="text-xl font-bold mb-2 flex justify-between">
            Player 2{" "}
            <span className="badge badge-secondary">
              Score: {scores.player2}
            </span>
          </h2>

          {currentPlayer === 2 ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter your word"
                required
              />
              <button className="btn btn-secondary">Submit</button>
            </form>
          ) : (
            <p className="text-gray-400 italic">Waiting for turn...</p>
          )}
        </div>
      </div>

      {/* Timer */}
      <div className="text-center mb-6">
        <p className="text-lg">
          ⏳ <span className="font-bold">{timer}s</span> left for Player{" "}
          {currentPlayer}
        </p>
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

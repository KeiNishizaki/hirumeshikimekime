import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import SwipeScreen from './components/SwipeScreen';
import MidtermScreen from './components/MidtermScreen';
import SortScreen from './components/SortScreen';
import ResultScreen from './components/ResultScreen';
import { LUNCH_OPTIONS } from './data/lunches';
import { Home, HelpCircle, X } from 'lucide-react';
import logoIcon from './assets/logo-icon.png';

function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [showHelp, setShowHelp] = useState(false);
  const [totalParticipants, setTotalParticipants] = useState(2);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState(
    LUNCH_OPTIONS.reduce((acc, lunch) => {
      acc[lunch.id] = 0;
      return acc;
    }, {})
  );
  const [topLunches, setTopLunches] = useState([]);

  // --- Handlers ---

  const handleStart = (participants) => {
    setTotalParticipants(participants);
    setCurrentPlayer(1);
    setCurrentScreen('swipe');
  };

  const handleSwipeRoundComplete = (roundScores) => {
    // Compute new scores synchronously
    const newScores = { ...scores };
    Object.keys(roundScores).forEach(id => {
      newScores[id] += roundScores[id];
    });
    setScores(newScores);

    if (currentPlayer < totalParticipants) {
      setCurrentPlayer(currentPlayer + 1);
    } else {
      // All swipe rounds complete. Calculate top 5 using new scores.
      const sorted = Object.entries(newScores)
        .map(([id, score]) => ({ id, score, ...LUNCH_OPTIONS.find(l => l.id === id) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setTopLunches(sorted);
      setCurrentScreen('midterm');
    }
  };

  const handleMidtermComplete = () => {
    setCurrentPlayer(1); // Reset for sort rounds
    setCurrentScreen('sort');
  };

  const handleSortRoundComplete = (sortedLunches) => {
    // Add scores based on rank
    const newScores = { ...scores };
    sortedLunches.forEach((lunch, index) => {
      const points = 5 - index;
      newScores[lunch.id] += points;
    });
    setScores(newScores);

    if (currentPlayer < totalParticipants) {
      setCurrentPlayer(currentPlayer + 1);
    } else {
      setCurrentScreen('result');
    }
  };

  const handleReset = () => {
    setCurrentScreen('start');
    setTotalParticipants(2);
    setCurrentPlayer(1);
    setScores(LUNCH_OPTIONS.reduce((acc, lunch) => ({ ...acc, [lunch.id]: 0 }), {}));
    setTopLunches([]);
  };

  // --- Render ---

  return (
    <div className="w-full min-h-[100dvh] pt-16 bg-slate-50 relative overflow-y-auto flex flex-col items-center justify-center font-sans text-slate-800">

      {/* Global Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md shadow-sm z-50 flex items-center justify-between px-4">
        {currentScreen !== 'start' ? (
          <button onClick={handleReset} className="p-2 text-slate-400 active:text-slate-600 hover:bg-slate-100 rounded-full transition-colors shadow-sm bg-white" aria-label="Home">
            <Home className="w-6 h-6" />
          </button>
        ) : (
          <div className="w-10"></div>
        )}
        <div className="font-extrabold text-slate-700 text-lg tracking-tight flex items-center">
          <img src={logoIcon} alt="fork and knife icon" className="w-6 h-6 mr-1.5 drop-shadow-sm" />
          HiruKime
          <img src={logoIcon} alt="fork and knife icon" className="w-6 h-6 ml-1.5 drop-shadow-sm transform -scale-x-100" />
        </div>
        <button onClick={() => setShowHelp(true)} className="p-2 text-slate-400 active:text-slate-600 hover:bg-slate-100 rounded-full transition-colors shadow-sm bg-white" aria-label="Help">
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {currentScreen === 'start' && (
        <StartScreen onStart={handleStart} />
      )}

      {currentScreen === 'swipe' && (
        <SwipeScreen
          currentPlayer={currentPlayer}
          totalParticipants={totalParticipants}
          onRoundComplete={handleSwipeRoundComplete}
        />
      )}

      {currentScreen === 'midterm' && (
        <MidtermScreen
          topLunches={topLunches}
          onNext={handleMidtermComplete}
        />
      )}

      {currentScreen === 'sort' && (
        <SortScreen
          topLunches={topLunches}
          currentPlayer={currentPlayer}
          totalParticipants={totalParticipants}
          onRoundComplete={handleSortRoundComplete}
        />
      )}

      {currentScreen === 'result' && (
        <ResultScreen
          topLunches={topLunches}
          scores={scores}
          onReset={handleReset}
        />
      )}

      {/* Global Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 mr-2 text-rose-400" />
              遊び方
            </h2>
            <ol className="text-left space-y-5 text-slate-700 font-medium text-base">
              <li className="flex items-center">
                <span className="bg-rose-100 text-rose-500 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0 mr-4">1</span>
                <div>人数を決める</div>
              </li>
              <li className="flex items-center">
                <span className="bg-rose-100 text-rose-500 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0 mr-4">2</span>
                <div>あり・なしを直感で選ぶ</div>
              </li>
              <li className="flex items-center">
                <span className="bg-rose-100 text-rose-500 font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0 mr-4">3</span>
                <div>みんなで並び替えて決定！</div>
              </li>
            </ol>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-8 py-3.5 bg-rose-400 text-white font-bold rounded-full hover:bg-rose-500 transition-colors shadow-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

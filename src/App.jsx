import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'

import Header from './components/Header'
import Leaderboard from './components/Leaderboard'
import Profile from './components/Profile'
import Figure from './components/Figure'
import WrongLetters from './components/WrongLetters'
import Word from './components/Word'
import Notification from './components/Notification'
import Popup from './components/Popup'
import CategorySelection from './components/CategorySelection'
import CharacterSelection from './components/CharacterSelection'
import HeartsDisplay from './components/HeartsDisplay'
import {characters} from './config/characterConfig'
import {difficultySettings} from "./config/difficultyConfig"
import {showNotification as show} from "./helpers/helpers"
import { checkWin } from './helpers/helpers';
import { getRandomWord, updatePlayerStats } from './helpers/firestore';
import { auth } from './firebase'
import './App.css'


function App() {
  const [selectedWord, setSelectedWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [playable, setPlayable] = useState(false);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [user, setUser] = useState(null);
  const [activeScreen, setActiveScreen] = useState('home');
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [showCharacterSelection, setShowCharacterSelection] = useState(false);
  const [selectedMode, setSelectedMode] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timedOut, setTimedOut] = useState(false);

  const maxWrongGuesses = selectedDifficulty
    ? difficultySettings[selectedDifficulty].maxWrongGuesses
    : 6; // Default to 6 if no difficulty is selected

  const timeLimit = selectedDifficulty
    ? difficultySettings[selectedDifficulty].timeLimit
    : 0; // Default to 0 if no difficulty is selected

  const selectedCharacterData = characters.find(
    (character) => character.id === selectedCharacter
  );

  useEffect(() => {
    const handleKeydown = event => {
      const { key, keyCode } = event;
      if (playable && keyCode >= 65 && keyCode <= 90) {
        const letter = key.toLowerCase();
        if (selectedWord.includes(letter)) {
          if (!correctLetters.includes(letter)) {
            setCorrectLetters(currentLetters => [...currentLetters, letter]);
          } else {
            show(setShowNotification);
          }
        } else {
          if (!wrongLetters.includes(letter)) {
            setWrongLetters(wrongLetters => [...wrongLetters, letter]);
          } else {
            show(setShowNotification);
          }
        }
      }
    }
    window.addEventListener('keydown', handleKeydown);

    return () => window.removeEventListener('keydown', handleKeydown);
  }, [correctLetters, wrongLetters, playable, selectedWord]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser && activeScreen === 'profile') {
        setActiveScreen('home');
      }
    });

    return unsubscribe;
  }, [activeScreen]);

  useEffect(() => {
    if (selectedMode !== "timed" || !gameStarted || loading || !playable)
    {
      return;
    }
    
    const timerId = setInterval(() => {
      setTimeRemaining((currentTime) => {
        if (currentTime === null) {
          return currentTime;
        }

        return Math.max(currentTime - 1, 0);
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [selectedMode, gameStarted, loading, playable]);

  useEffect(() => {
    if (selectedMode === "timed" && gameStarted && playable && timeRemaining === 0)
    {
      setPlayable(false);
      setTimedOut(true);
    }  
  }, [selectedMode, gameStarted, playable, timeRemaining]);

  function goToCharacterSelection() {
    setShowCharacterSelection(true);
  }

  function goBackToSetup() {
    setShowCharacterSelection(false);
  }

  function quitGame() {
    const confirmed = window.confirm(
      "Are you sure you want to quit? All current game progress will be reset."
    );

    if (!confirmed) {
      return;
    }

    setPlayable(false);
    setGameStarted(false);
    setLoading(false);
    setShowCharacterSelection(false);
    setActiveScreen('home');
    setSelectedCategory("");
    setSelectedDifficulty("");
    setSelectedMode("");
    setSelectedCharacter("");
    setSelectedWord("");
    setCorrectLetters([]);
    setWrongLetters([]);
    setScore(0);
    setShowNotification(false);
    setTimeRemaining(null);
    setTimedOut(false);
  }

  async function startGame() {
    if (!selectedCharacter) {
      return;
    }
    
    try {
      setLoading(true);
      setGameStarted(true);
      setShowCharacterSelection(false);

      const word = await getRandomWord(selectedCategory);

      setSelectedWord(word);
      setCorrectLetters([]);
      setWrongLetters([]);
      setPlayable(false);

      if (selectedMode === "timed") {
        setTimeRemaining(timeLimit);
      } else {
        setTimeRemaining(null);
      }

      setPlayable(true);

    } catch (error) {
      console.error(error);
      alert("No words were found for this category.");
      setGameStarted(false);
      setShowCharacterSelection(true);
    } finally {
      setLoading(false);
    }
  }

  async function playAgain() {
    const previousResult = checkWin(
      correctLetters,
      wrongLetters,
      selectedWord,
      maxWrongGuesses,
      timedOut
    );

    setLoading(true);
    setCorrectLetters([]);
    setWrongLetters([]);
    setTimedOut(false);

    if (previousResult === 'lose') {
      setScore(0);
    }

    try {
      const word = await getRandomWord(selectedCategory);

      setSelectedWord(word);

      if (selectedMode === "timed") {
        setTimeRemaining(timeLimit);
      } else {
        setTimeRemaining(null);
      }

      setPlayable(true);
    } catch (error) {
      console.error(error);
      alert("Unable to load another word.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGameComplete({ result, roundScore, sessionScore }) {
    if (!user) return;

    try {
      await updatePlayerStats(user.uid, roundScore, sessionScore, result === 'win', user.displayName);
    } catch (error) {
      console.error('Unable to update player stats', error);
    }
  }
  

  return (
    <>
      <Header user={user} onProfile={() => setActiveScreen('profile')} onLeaderboard={() => setActiveScreen('leaderboard')} />
      {activeScreen === 'profile' ? (
        <Profile user={user} onBack={() => setActiveScreen('home')} />
      ) : activeScreen === 'leaderboard' ? (
        <Leaderboard onBack={() => setActiveScreen('home')} user={user} />
      ) : !gameStarted && !showCharacterSelection ? (
        <CategorySelection
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          goToCharacterSelection={goToCharacterSelection}
        /> 
      ) : !gameStarted && showCharacterSelection ? (
        <CharacterSelection
          selectedCharacter={selectedCharacter}
          setSelectedCharacter={setSelectedCharacter}
          startGame={startGame}
          goBack={goBackToSetup}
        />
      ) :loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="game-information">
            <p>
              Mode:{""}
              <span className="game-information-value">
                {selectedMode === "timed" ? "Timed" : "Classic"}
              </span>
            </p>

            <p>
              Category:{""}
              <span className="game-information-value">{selectedCategory}</span>
            </p>

            <p>
              Difficulty:{""}
              <span className="game-information-value">{difficultySettings[selectedDifficulty].label}</span>
            </p>

            {selectedMode === "timed" && (
              <p
                className={
                  timeRemaining <= 10
                    ? "timer-display timer-warning"
                    : "timer-display"
                }
              >
                Time:{" "}
                <span className="game-information-value">
                  {timeRemaining}s
                </span>
              </p>
            )}

            <div className="lives-display">
              <span>Lives:</span>
              <HeartsDisplay 
                maxWrongGuesses={maxWrongGuesses} 
                wrongLetters={wrongLetters} 
              />
            </div>

            <button
              type="button"
              className="quit-game-button"
              onClick={quitGame}
            >
              Quit Game
            </button>
          </div>

          <div className="game-container">
            <Figure 
              selectedCharacterData={selectedCharacterData}
            />
            <WrongLetters wrongLetters={wrongLetters}/>
            <Word 
              selectedWord={selectedWord} 
              correctLetters={correctLetters}
            />
          </div>

          <Popup 
            correctLetters={correctLetters} 
            wrongLetters={wrongLetters}
            selectedWord={selectedWord}
            setPlayable={setPlayable}
            playAgain={playAgain}
            score={score}
            setScore={setScore}
            maxWrongGuesses={maxWrongGuesses}
            onGameComplete={handleGameComplete}
            timedOut={timedOut}
            quitGame={quitGame}
            selectedMode={selectedMode}
            timeRemaining={timeRemaining}
            timeLimit={timeLimit}
          />
          <Notification showNotification={showNotification}/>
        </>
      )}
    </>
  );
}


export default App;

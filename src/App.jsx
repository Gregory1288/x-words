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
import DailyWordResults from './components/DailyWordResults'
import {characters} from './config/characterConfig'
import {difficultySettings} from "./config/difficultyConfig"
import {showNotification as show} from "./helpers/helpers"
import { checkWin } from './helpers/helpers';
import { getRandomWord, updatePlayerStats, getDailyDateKey, getDailyWord, getDailyAttempt, saveDailyAttempt, } from './helpers/firestore';
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

  const [isDailyWord, setIsDailyWord] = useState(false);
  const [dailyWordData, setDailyWordData] = useState(null);
  const [dailyWordLoading, setDailyWordLoading] = useState(false);
  const [dailyElapsedTime, setDailyElapsedTime] = useState(0);
  const [dailyStartedAt, setDailyStartedAt] = useState(null);
  const [dailyAttemptSaving, setDailyAttemptSaving] = useState(false);
  const [dailyAttemptSaved, setDailyAttemptSaved] = useState(false);
  const [dailyAttemptError, setDailyAttemptError] = useState("");
  const [dailyCompletionTime, setDailyCompletionTime] = useState(null);
  const [dailyResultsDateKey, setDailyResultsDateKey] = useState("");

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
      if (!currentUser && (activeScreen === 'profile' || activeScreen === "daily-results")) {
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

  useEffect(() => {
    if (!isDailyWord || !gameStarted || loading || !playable || dailyStartedAt === null) {
      return;
    }
  
    function updateElapsedTime() {
      const secondsElapsed = Math.floor(
        (Date.now() - dailyStartedAt) / 1000
      );

      setDailyElapsedTime(secondsElapsed);
    }

    updateElapsedTime();

    const timerId = setInterval(updateElapsedTime, 1000);
    
    return () => clearInterval(timerId);
  }, [isDailyWord, gameStarted, loading, playable, dailyStartedAt,]);

  useEffect(() => {
    const shouldLockScroll = gameStarted && activeScreen === "home";
    document.body.classList.toggle("game-scroll-locked", shouldLockScroll);

    return () => {document.body.classList.remove("game-scroll-locked")};
  }, [gameStarted, activeScreen]);

  function goToCharacterSelection() {
    setIsDailyWord(false);
    setDailyWordData(null);
    setDailyElapsedTime(0);
    setDailyStartedAt(null);
    setShowCharacterSelection(true);
  }

  function goBackToSetup() {
    setShowCharacterSelection(false);
    setSelectedCharacter("");

    if (isDailyWord) {
      setIsDailyWord(false);
      setDailyWordData(null);
      setDailyElapsedTime(0);
      setDailyStartedAt(null);
      setDailyAttemptSaving(false);
      setDailyAttemptSaved(false);
      setDailyAttemptError("");
      setDailyCompletionTime(null);
      setSelectedMode("");
      setSelectedCategory("");
      setSelectedDifficulty("");
    }
  }

  function resetGameState() {
    setPlayable(false);
    setGameStarted(false);
    setLoading(false);
    setShowCharacterSelection(false);
    setActiveScreen("home");
    setSelectedMode("");
    setSelectedCategory("");
    setSelectedDifficulty("");
    setSelectedCharacter("");
    setSelectedWord("");
    setCorrectLetters([]);
    setWrongLetters([]);
    setScore(0);
    setShowNotification(false);
    setTimeRemaining(null);
    setTimedOut(false);
    setIsDailyWord(false);
    setDailyWordData(null);
    setDailyWordLoading(false);
    setDailyElapsedTime(0);
    setDailyStartedAt(null);
    setDailyAttemptSaving(false);
    setDailyAttemptSaved(false);
    setDailyAttemptError("");
    setDailyCompletionTime(null);
  }

  function returnToHome() {
    resetGameState();
  }

  function viewDailyResults() {
    const completedDateKey = dailyWordData?.dateKey || getDailyDateKey();

    resetGameState();

    setDailyResultsDateKey(completedDateKey);

    setActiveScreen("daily-results");
  }

  function quitGame() {
    const confirmed = window.confirm(
      "Are you sure you want to quit? All current game progress will be reset."
    );

    if (!confirmed) {
      return;
    }

    resetGameState();
  }

  async function handleDailyWordSelection() {
    if (!user) {
      alert(
        "Please sign in with Google before playing the Daily Word."
      );
      return;
    }

    try {
      setDailyWordLoading(true);
      const dateKey = getDailyDateKey();
      const existingAttempt = await getDailyAttempt(user.uid, dateKey);

      if (existingAttempt) {
        setDailyResultsDateKey(dateKey);
        setActiveScreen("daily-results");

        return;
      }

      const todayWord = await getDailyWord(dateKey);
      const category = todayWord.category.trim().toLowerCase();
      const difficulty = todayWord.difficulty.trim().toLowerCase();
      const word = todayWord.word.trim().toLowerCase();

      if (!difficultySettings[difficulty]) {
        throw new Error(`Invalid Daily Word difficulty: ${difficulty}`);
      }

      setDailyAttemptSaving(false);
      setDailyAttemptSaved(false);
      setDailyAttemptError("");
      setDailyCompletionTime(null);

      setScore(0);
      setSelectedWord("");
      setCorrectLetters([]);
      setWrongLetters([]);

      setDailyWordData({...todayWord, dateKey, category, difficulty, word});
      setIsDailyWord(true);
      setSelectedMode("");
      setSelectedCategory(category);
      setSelectedDifficulty(difficulty);
      setSelectedCharacter("");
      setDailyElapsedTime(0);
      setDailyStartedAt(null);
      setShowCharacterSelection(true);
    } catch (error) {
      console.error("Unable to prepare Daily Word:", error);
      alert(error.message ||"Unable to load today's Daily Word.");
    } finally {
      setDailyWordLoading(false);
    }
  }

  async function startGame() {
    if (!selectedCharacter) {
      return;
    }

    if (isDailyWord && !dailyWordData) {
      alert("Today's Daily Word could not be found.");
      return;
    }
    
    try {
      setLoading(true);
      setGameStarted(true);
      setShowCharacterSelection(false);

      const word = isDailyWord
        ? dailyWordData.word 
        : await getRandomWord(selectedCategory);

      setSelectedWord(word);
      setCorrectLetters([]);
      setWrongLetters([]);
      setTimedOut(false);
      setPlayable(false);

      if (isDailyWord) {
        setTimeRemaining(null);
        setDailyElapsedTime(0);
        setDailyCompletionTime(null);
        setDailyStartedAt(Date.now());
      } else if (selectedMode === "timed") {
        setTimeRemaining(timeLimit);
        setDailyElapsedTime(0);
        setDailyStartedAt(null);
      } else {
        setTimeRemaining(null);
        setDailyElapsedTime(0);
        setDailyStartedAt(null);
      }

      setPlayable(true);

    } catch (error) {
      console.error(error);
      alert(
        isDailyWord
          ? "Unable to start today's Daily Word."
          : "No words were found for this category."
      );
      setGameStarted(false);
      setShowCharacterSelection(true);
    } finally {
      setLoading(false);
    }
  }

  async function playAgain() {
    if (isDailyWord) {
      returnToHome();
      return;
    }

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

    if (!isDailyWord) {
      try {
        await updatePlayerStats(user.uid, roundScore, sessionScore, result === 'win', user.displayName);
      } catch (error) {
        console.error('Unable to update player stats', error);
      }

      return;
    }

    // Prevent the same Daily Word result from being saved repeatedly.
    if (!dailyWordData || dailyAttemptSaving || dailyAttemptSaved) return;

    // Freeze the completion time when result first appears.
    // On a retry, reuse the same time instead of measuring again.
    let finalCompletionTime = dailyCompletionTime;

    if (finalCompletionTime === null) {
      if (dailyStartedAt !== null) {
        finalCompletionTime = Math.max(1, Math.floor((Date.now() - dailyStartedAt) / 1000));
      } else {
        finalCompletionTime = Math.max(1, dailyElapsedTime);
      }

      setDailyCompletionTime(finalCompletionTime);
      setDailyElapsedTime(finalCompletionTime);
    }

    try {
      setDailyAttemptSaving(true);
      setDailyAttemptError("");

      await saveDailyAttempt({
        userId: user.uid,
        displayName: user.displayName || user.email || "Anonymous Player",
        dateKey: dailyWordData.dateKey || getDailyDateKey(),
        result,
        wrongGuesses: wrongLetters.length,
        completionTimeSeconds: finalCompletionTime,
        score: roundScore,
      });

      setDailyAttemptSaved(true);
    } catch (error) {
      console.error(
        "Unable to save Daily Word attempt:",
        error
      );

      if (error.code === "permission-denied") {
        setDailyAttemptError("This Daily Word attempt may already have been submitted.");
      } else {
        setDailyAttemptError("Your result could not be saved. Please try again.");
      }
    } finally {
      setDailyAttemptSaving(false);
    }
  }

  function formatElapsedTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <>
      <Header user={user} onProfile={() => setActiveScreen('profile')} onLeaderboard={() => setActiveScreen('leaderboard')} />
      {activeScreen === 'profile' ? (
        <Profile user={user} onBack={() => setActiveScreen('home')} />
      ) : activeScreen === 'leaderboard' ? (
        <Leaderboard onBack={() => setActiveScreen('home')} user={user} />
      ) : activeScreen === "daily-results" ? (
        <DailyWordResults 
          user={user}
          dateKey={dailyResultsDateKey || getDailyDateKey()}
          onBack={() => {
            setDailyResultsDateKey("");
            setActiveScreen("home");
          }}
        />
      ) : !gameStarted && !showCharacterSelection ? (
        <CategorySelection
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          goToCharacterSelection={goToCharacterSelection}
          onDailyWord={handleDailyWordSelection}
          dailyWordLoading={dailyWordLoading}
          isSignedIn={Boolean(user)}
        /> 
      ) : !gameStarted && showCharacterSelection ? (
        <CharacterSelection
          selectedCharacter={selectedCharacter}
          setSelectedCharacter={setSelectedCharacter}
          startGame={startGame}
          goBack={goBackToSetup}
          title={
            isDailyWord
              ? "Choose Your Daily Word Character"
              : "Select a Character"
          }
          subtitle={
            isDailyWord
              ? `${selectedCategory} • ${
                difficultySettings[selectedDifficulty]?.label 
                }`
              : ""
          }
          startButtonText={
            isDailyWord
              ? "Start Daily Word"
              : "Start Game"
          }
        />
      ) :loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="game-information">
            <p>
              Mode:{""}
              <span className="game-information-value">
                {isDailyWord
                  ? "Daily Word"
                  : selectedMode === "timed" 
                    ? "Timed" 
                    : "Classic"}
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

            {isDailyWord && (
              <p className="daily-timer-display">
                Time:{" "}
                <span className="game-information-value">
                  {formatElapsedTime(dailyElapsedTime)}
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
            isDailyWord={isDailyWord}
            viewDailyResults={viewDailyResults}
            dailyAttemptSaving={dailyAttemptSaving}
            dailyAttemptSaved={dailyAttemptSaved}
            dailyAttemptError={dailyAttemptError}
            dailyCompletionTime={dailyCompletionTime !== null ? dailyCompletionTime : dailyElapsedTime}
          />
          <Notification showNotification={showNotification}/>
        </>
      )}
    </>
  );
}


export default App;

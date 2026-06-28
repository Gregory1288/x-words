import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'

import Header from './components/Header'
import Profile from './components/Profile'
import Figure from './components/Figure'
import WrongLetters from './components/WrongLetters'
import Word from './components/Word'
import Notification from './components/Notification'
import Popup from './components/Popup'
import CategorySelection from './components/CategorySelection'
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

  const maxWrongGuesses = selectedDifficulty
    ? difficultySettings[selectedDifficulty].maxWrongGuesses
    : 6; // Default to 6 if no difficulty is selected


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

  async function startGame() {
    try {
      setLoading(true);
      setGameStarted(true);

      const word = await getRandomWord(selectedCategory);

      setSelectedWord(word);
      setCorrectLetters([]);
      setWrongLetters([]);
      setPlayable(true);
    } catch (error) {
      console.error(error);
      alert("No words were found for this category.");
      setGameStarted(false);
    } finally {
      setLoading(false);
    }
  }

  async function playAgain() {
    setLoading(true);
    setCorrectLetters([]);
    setWrongLetters([]);

    if (checkWin(correctLetters, wrongLetters, selectedWord, maxWrongGuesses) === 'lose') {
      setScore(0);
    }

    try {
      const word = await getRandomWord(selectedCategory);

      setSelectedWord(word);
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
      await updatePlayerStats(user.uid, roundScore, sessionScore, result === 'win');
    } catch (error) {
      console.error('Unable to update player stats', error);
    }
  }
  

  return (
    <>
      <Header user={user} onProfile={() => setActiveScreen('profile')} />
      {activeScreen === 'profile' ? (
        <Profile user={user} onBack={() => setActiveScreen('home')} />
      ) : !gameStarted ? (
        <CategorySelection
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          startGame={startGame}
        /> 
      ) :loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="current-category">
            Category: {selectedCategory}
          </p>

          <div className="game-information">
            <p>
              Difficulty:{" "}
              {difficultySettings[selectedDifficulty].label}
            </p>

            <p>
              Wrong guesses remaining:{" "}
              {Math.max(maxWrongGuesses - wrongLetters.length, 0)}
            </p>
          </div>

          <div className="game-container">
            <Figure 
              wrongLetters={wrongLetters}
              maxWrongGuesses={maxWrongGuesses}
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
          />
          <Notification showNotification={showNotification}/>
        </>
      )}
    </>
  );
}


export default App

import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

import Header from './components/Header'
import Figure from './components/Figure'
import WrongLetters from './components/WrongLetters'
import Word from './components/Word'
import Notification from './components/Notification'
import Popup from './components/Popup'
import {showNotification as show} from "./helpers/helpers"
import { checkWin } from './helpers/helpers';
import { getRandomWord } from './helpers/firestore';
import './App.css'


function App() {
  const [selectedWord, setSelectedWord] = useState("");
  const [loading, setLoading] = useState(true);
  const [playable, setPlayable] = useState(false);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    getRandomWord().then(word => {
      setSelectedWord(word);
      setLoading(false);
      setPlayable(true);
    });
  }, []);

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
  }, [correctLetters, wrongLetters, playable]);

  function playAgain() {
    setLoading(true);
    setCorrectLetters([]);
    setWrongLetters([]);

    if (checkWin(correctLetters, wrongLetters, selectedWord) === 'lose') {
      setScore(0);
    }

    getRandomWord().then(word => {
      setSelectedWord(word);
      setLoading(false);
      setPlayable(true);
    });
  }

  return (
    <>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="game-container">
          <Figure wrongLetters={wrongLetters}/>
          <WrongLetters wrongLetters={wrongLetters}/>
          <Word selectedWord={selectedWord} correctLetters={correctLetters}/>
        </div>
      )}
      <Popup correctLetters={correctLetters} wrongLetters={wrongLetters} selectedWord={selectedWord} 
      setPlayable={setPlayable} playAgain={playAgain} score={score} setScore={setScore}/>
      <Notification showNotification={showNotification} />
    </>
  );
}

export default App

import React, { useEffect } from 'react';
import { checkWin } from '../helpers/helpers';

const Popup = ({correctLetters, wrongLetters, selectedWord, setPlayable, playAgain, score, setScore}) => {
  let finalMessage = '';
  let finalMessageRevealWord = '';
  let playable = true;
  let buttonText = '';

  if( checkWin(correctLetters, wrongLetters, selectedWord) === 'win' ) {
    finalMessage = 'Congratulations! You won! 😃';
    playable = false;
    buttonText = 'Continue';
  } else if( checkWin(correctLetters, wrongLetters, selectedWord) === 'lose' ) {
    finalMessage = 'Unfortunately you lost. 😕';
    finalMessageRevealWord = `...the word was: ${selectedWord}`;
    playable = false;
    buttonText = 'Try Again';
  }

  useEffect(() => {
    setPlayable(playable);
  });

  useEffect(() => {
    if(!playable) {
      setScore(prev => prev + 6 - wrongLetters.length);
    }
  }, [playable]);

  return (
    <div className="popup-container" style={finalMessage !== '' ? {display:'flex'} : {}}>
      <div className="popup">
        <h2>{finalMessage}</h2>
        <h3>{finalMessageRevealWord}</h3>
        <h3>Your score: {score}</h3>
        <button onClick={playAgain}>{buttonText}</button>
      </div>
    </div>
  )
}

export default Popup
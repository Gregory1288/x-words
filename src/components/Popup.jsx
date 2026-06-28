import React, { useEffect, useRef } from 'react';
import { checkWin } from '../helpers/helpers';

const Popup = ({correctLetters, wrongLetters, selectedWord, setPlayable, playAgain, score, setScore, maxWrongGuesses, onGameComplete}) => {
  let finalMessage = '';
  let finalMessageRevealWord = '';
  let playable = true;
  let buttonText = '';
  const result = selectedWord ? checkWin(correctLetters, wrongLetters, selectedWord, maxWrongGuesses) : ""; // safe check for empty selectedWord
  const hasReportedResult = useRef(false);

  if( result === 'win' ) {
    finalMessage = 'Congratulations! You won! 😃';
    playable = false;
    buttonText = 'Continue';
  } else if( result === 'lose' ) {
    finalMessage = 'Unfortunately you lost. 😕';
    finalMessageRevealWord = `...the word was: ${selectedWord}`;
    playable = false;
    buttonText = 'Try Again';
  }

  useEffect(() => {
    setPlayable(playable);
  },[playable]);

  useEffect(() => {
    if(result === 'win') {
      setScore(prev => prev + 6 - wrongLetters.length);
    }
  }, [result, wrongLetters.length, setScore]);

  useEffect(() => {
    if (result && !hasReportedResult.current) {
      const roundScore = result === 'win' ? Math.max(6 - wrongLetters.length, 0) : 0;
      onGameComplete?.({ result, roundScore });
      hasReportedResult.current = true;
    }
  }, [result, wrongLetters.length, onGameComplete])

  useEffect(() => {
    hasReportedResult.current = false;
  }, [selectedWord])

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
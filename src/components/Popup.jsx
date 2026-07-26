import React, { useEffect, useRef, useState } from 'react';
import { checkWin } from '../helpers/helpers';
import { fetchWordFact } from '../helpers/ai';

const Popup = ({correctLetters, wrongLetters, selectedWord, setPlayable, playAgain, score, setScore, maxWrongGuesses, onGameComplete}) => {
  let finalMessage = '';
  let finalMessageRevealWord = '';
  let playable = true;
  let buttonText = '';
  const result = selectedWord ? checkWin(correctLetters, wrongLetters, selectedWord, maxWrongGuesses) : "";
  const hasReportedResult = useRef(false);
  const [wordFact, setWordFact] = useState(null);
  const [factLoading, setFactLoading] = useState(false);

  if (result === 'win') {
    finalMessage = 'Congratulations! You won! 😃';
    playable = false;
    buttonText = 'Continue';
  } else if (result === 'lose') {
    finalMessage = 'Unfortunately you lost. 😕';
    finalMessageRevealWord = `...the word was: ${selectedWord}`;
    playable = false;
    buttonText = 'Try Again';
  }

  useEffect(() => {
    setPlayable(playable);
  }, [playable]);

  useEffect(() => {
    if (result === 'win') {
      setScore(prev => prev + 6 - wrongLetters.length);
    }
  }, [result, wrongLetters.length, setScore]);

  useEffect(() => {
    if (result && !hasReportedResult.current) {
      const roundScore = result === 'win' ? Math.max(6 - wrongLetters.length, 0) : 0;
      const sessionScore = result === 'win' ? score + roundScore : score;
      onGameComplete?.({ result, roundScore, sessionScore });
      hasReportedResult.current = true;
    }
  }, [result, wrongLetters.length, onGameComplete]);

  useEffect(() => {
    if ((result === 'win' || result === 'lose') && selectedWord) {
      setWordFact(null);
      setFactLoading(true);
      fetchWordFact(selectedWord)
        .then(fact => setWordFact(fact))
        .catch(() => setWordFact(null))
        .finally(() => setFactLoading(false));
    }
  }, [result, selectedWord]);

  useEffect(() => {
    hasReportedResult.current = false;
    setWordFact(null);
    setFactLoading(false);
  }, [selectedWord]);

  return (
    <div className="popup-container" style={finalMessage !== '' ? {display:'flex'} : {}}>
      <div className="popup">
        <h2>{finalMessage}</h2>
        <h3>{finalMessageRevealWord}</h3>
        <h3>Your score: {score}</h3>

        {(result === 'win' || result === 'lose') && (
          <div className="word-fact">
            {factLoading ? (
              <p className="word-fact-loading">Loading fun fact...</p>
            ) : wordFact ? (
              <p className="word-fact-text">💡 {wordFact}</p>
            ) : null}
          </div>
        )}

        <button onClick={playAgain}>{buttonText}</button>
      </div>
    </div>
  );
}

export default Popup;
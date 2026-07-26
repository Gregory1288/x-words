import React, { useEffect, useRef, useState } from 'react';
import { checkWin } from '../helpers/helpers';
import { fetchWordFact } from '../helpers/ai';

const Popup = ({correctLetters, wrongLetters, selectedWord, setPlayable, playAgain, quitGame, score, setScore, maxWrongGuesses, onGameComplete, timedOut, selectedMode, timeRemaining, timeLimit}) => {
  let finalMessage = '';
  let finalMessageRevealWord = '';
  let playable = true;
  let buttonText = '';
  const result = selectedWord ? checkWin(correctLetters, wrongLetters, selectedWord, maxWrongGuesses, timedOut) : "";
  const hasReportedResult = useRef(false);
  const [wordFact, setWordFact] = useState(null);
  const [factLoading, setFactLoading] = useState(false);
  const baseScore = result === 'win' ? Math.max(6 - wrongLetters.length, 0) : 0;
  const timeBonus = result === 'win' && selectedMode === 'timed' && timeLimit > 0 ? Math.ceil((Math.max(timeRemaining ?? 0, 0) / timeLimit) * 10) : 0;
  const roundScore = result === 'win' ? baseScore + timeBonus : 0;

  if (result === 'win') {
    finalMessage = 'Congratulations! You won! 😃';
    playable = false;
    buttonText = 'Continue';
  } else if( result === 'lose' ) {
    finalMessage = timedOut
      ? 'Time is up! ⏰'
      : 'Unfortunately you lost. 😕';
    finalMessageRevealWord = `...the word was: ${selectedWord}`;
    playable = false;
    buttonText = 'Try Again';
  }

  useEffect(() => {
    setPlayable(playable);
  }, [playable]);

  useEffect(() => {
    if (!result || hasReportedResult.current) return;
    hasReportedResult.current = true;
    const newSessionScore = result === 'win' ? score + roundScore : score;
    if (result === 'win') {
      setScore(newSessionScore);
    }
    onGameComplete?.({ result, roundScore, sessionScore: newSessionScore });
  }, [result, roundScore, score, setScore, onGameComplete]);

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

        {result === 'win' && (
          <div className='score-breakdown'>
            <p>Base Score: {baseScore}</p>
            {selectedMode === 'timed' && (
              <p>Time Bonus: +{timeBonus}</p>
            )}
            <p className='round-score'>
              Round Score: +{roundScore}
            </p>
          </div>
        )}
        
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

        <div className="popup-actions">
          <button onClick={playAgain}>{buttonText}</button>
          <button
            type="button"
            className="popup-quit-button"
            onClick={quitGame}
          >
            Quit Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
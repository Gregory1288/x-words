import React, { useEffect, useRef } from 'react';
import { checkWin } from '../helpers/helpers';

const Popup = ({
  correctLetters, 
  wrongLetters, 
  selectedWord, 
  setPlayable, 
  playAgain, 
  quitGame, 
  score, 
  setScore, 
  maxWrongGuesses, 
  onGameComplete, 
  timedOut, 
  selectedMode, 
  timeRemaining, 
  timeLimit, 
  isDailyWord, 
  viewDailyResults,
  dailyAttemptSaving,
  dailyAttemptSaved,
  dailyAttemptError,
  dailyCompletionTimeSeconds,
}) => {
  let finalMessage = '';
  let finalMessageRevealWord = '';
  let playable = true;
  let buttonText = '';
  const result = selectedWord ? checkWin(correctLetters, wrongLetters, selectedWord, maxWrongGuesses, timedOut) : ""; // safe check for empty selectedWord
  const hasReportedResult = useRef(false);
  const baseScore = result === 'win' ? Math.max(6 - wrongLetters.length, 0) : 0;
  const timeBonus = result === 'win' && selectedMode === 'timed' && timeLimit > 0 ? Math.ceil((Math.max(timeRemaining ?? 0, 0) / timeLimit) * 10) : 0; // Calculate time bonus based on remaining time and time limit
  const roundScore = result === 'win' ? baseScore + timeBonus : 0; // Total score for the round
  const handlePrimaryAction = isDailyWord 
    ? viewDailyResults
    : playAgain;

  if( result === 'win' ) {
    finalMessage = isDailyWord
      ? 'Daily Word completed! 🎯'
      : 'Congratulations! You won! 😃';
    playable = false;
    buttonText = isDailyWord
      ? 'View Daily Results'
      : 'Continue';
  } else if( result === 'lose' ) {
    finalMessage = timedOut
      ? 'Time is up! ⏰'
      : 'Unfortunately you lost. 😕';
    finalMessageRevealWord = `...the word was: ${selectedWord}`;
    playable = false;
    buttonText = isDailyWord
      ? 'View Daily Results'
      : 'Try Again';
  }

  useEffect(() => {
    setPlayable(playable);
  },[playable]);

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
    hasReportedResult.current = false;
  }, [selectedWord])

  function formatCompletionTime(totalSeconds) {
    const safeSeconds = Math.max(totalSeconds ?? 0, 0);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function retryDailyAttemptSave() {
    if (!isDailyWord || dailyAttemptSaving || dailyAttemptSaved) return;
    onGameComplete?.({result, roundScore,sessionScore: score,});
  }

  return (
    <div className="popup-container" style={finalMessage !== '' ? {display:'flex'} : {}}>
      <div className="popup">
        <h2>{finalMessage}</h2>
        <h3>{finalMessageRevealWord}</h3>

        {isDailyWord && result && (
          <div className="daily-result-details">
            <p>
              Result:{" "}
              <strong>
                {result === "win" ? "Completed" : "Lost"}
              </strong>
            </p>

            <p>
              Incorrect guesses:{" "}
              <strong>{wrongLetters.length}</strong>
            </p>

            <p>
              Completion time:{" "}
              <strong>
                {formatCompletionTime(dailyCompletionTimeSeconds)}
              </strong>
            </p>

            <p>
              Daily score:{" "}
              <strong>{roundScore}</strong>
            </p>
          </div>
        )}

        {result === 'win' && !isDailyWord && (
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
        
        {!isDailyWord && (
          <h3>Your score: {score}</h3>
        )}

        {isDailyWord && dailyAttemptSaving && (
          <p className="daily-save-status saving">
            Saving your Daily Word result...
          </p>
        )}

        {isDailyWord && dailyAttemptSaved && (
          <p className="daily-save-status saved">
            Result saved successfully! ✅
          </p>
        )}

        {isDailyWord && dailyAttemptError && (
          <div className="daily-save-error">
            <p>{dailyAttemptError}</p>

            <button
              type="button"
              onClick={retryDailyAttemptSave}
              disabled={dailyAttemptSaving}
            >
              Retry Save
            </button>
          </div>
        )}
        
        <div className="popup-actions">
          <button 
            onClick={handlePrimaryAction}
            disabled={isDailyWord && !dailyAttemptSaved}
          >
            {isDailyWord && dailyAttemptSaving
              ? "Saving Result..."
              : buttonText}
          </button>

          {!isDailyWord && (
            <button
              type="button"
              className="popup-quit-button"
              onClick={quitGame}
            >
              Quit Game
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Popup
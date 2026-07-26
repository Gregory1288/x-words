import { describe, it, expect, vi } from 'vitest';
import { checkWin, showNotification } from '../helpers/helpers';

describe('checkWin', () => {
  it('returns "win" when all letters are guessed', () => {
    const result = checkWin(['h','a','n','g','m'], [], 'hangman', 6, false);
    expect(result).toBe('win');
  });

  it('returns "lose" when wrong guesses reach max', () => {
    const result = checkWin([], ['x','y','z','q','w','v'], 'hangman', 6, false);
    expect(result).toBe('lose');
  });

  it('returns empty string when game is in progress', () => {
    const result = checkWin(['h','a'], ['z'], 'hangman', 6, false);
    expect(result).toBe('');
  });

  it('returns "lose" when timedOut is true', () => {
    const result = checkWin([], [], 'hangman', 6, true);
    expect(result).toBe('lose');
  });
});

describe('showNotification', () => {
  it('sets notification to true then false after delay', async () => {
    vi.useFakeTimers();
    const setShowNotification = vi.fn();

    showNotification(setShowNotification);

    expect(setShowNotification).toHaveBeenCalledWith(true);

    vi.advanceTimersByTime(2000);
    expect(setShowNotification).toHaveBeenCalledWith(false);

    vi.useRealTimers();
  });
});

describe('score calculation', () => {
  it('awards 6 points for a perfect win with no wrong guesses', () => {
    const wrongLetters = [];
    const roundScore = Math.max(6 - wrongLetters.length, 0);
    expect(roundScore).toBe(6);
  });

  it('awards 0 points minimum even with many wrong guesses', () => {
    const wrongLetters = ['a','b','c','d','e','f','g','h'];
    const roundScore = Math.max(6 - wrongLetters.length, 0);
    expect(roundScore).toBe(0);
  });
});
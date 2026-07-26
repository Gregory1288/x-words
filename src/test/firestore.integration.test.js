import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock Firebase modules ──
vi.mock('../firebase', () => ({
  db: {},
  auth: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
}));

import {
  collection, doc, getDoc, getDocs, setDoc, query, where
} from 'firebase/firestore';
import { getRandomWord, updatePlayerStats } from '../helpers/firestore';

beforeEach(() => {
  vi.clearAllMocks();
});

// ════════════════════════════════════════
// getRandomWord
// ════════════════════════════════════════
describe('getRandomWord', () => {
  it('returns a word from the correct category', async () => {
    const mockDocs = [
      { data: () => ({ word: 'javascript', category: 'technology' }) },
      { data: () => ({ word: 'python', category: 'technology' }) },
    ];

    query.mockReturnValue('mockQuery');
    getDocs.mockResolvedValue({ docs: mockDocs });

    const word = await getRandomWord('technology');
    expect(['javascript', 'python']).toContain(word);
  });

  it('throws an error when no words found for category', async () => {
    query.mockReturnValue('mockQuery');
    getDocs.mockResolvedValue({ docs: [] });

    await expect(getRandomWord('sports')).rejects.toThrow(
      'No words found for this category'
    );
  });

  it('returns a single word string', async () => {
    query.mockReturnValue('mockQuery');
    getDocs.mockResolvedValue({
      docs: [{ data: () => ({ word: 'elephant', category: 'animals' }) }]
    });

    const word = await getRandomWord('animals');
    expect(typeof word).toBe('string');
    expect(word.length).toBeGreaterThan(0);
  });

  it('queries firestore with the correct category filter', async () => {
    query.mockReturnValue('mockQuery');
    getDocs.mockResolvedValue({
      docs: [{ data: () => ({ word: 'pizza', category: 'food' }) }]
    });

    await getRandomWord('food');
    expect(where).toHaveBeenCalledWith('category', '==', 'food');
  });
});

// ════════════════════════════════════════
// updatePlayerStats
// ════════════════════════════════════════
describe('updatePlayerStats', () => {
  it('creates a new stats document for a first time player', async () => {
    doc.mockReturnValue('mockRef');
    getDoc.mockResolvedValue({ exists: () => false });
    setDoc.mockResolvedValue();

    await updatePlayerStats('alice-uid', 5, 5, true, 'Alice');

    expect(setDoc).toHaveBeenCalledWith(
      'mockRef',
      expect.objectContaining({
        totalGamesPlayed: 1,
        totalGamesWon: 1,
        totalScore: 5,
        highScore: 5,
        displayName: 'Alice',
      }),
      { merge: true }
    );
  });

  it('increments stats correctly for a returning player on a win', async () => {
    doc.mockReturnValue('mockRef');
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        totalGamesPlayed: 2,
        totalGamesWon: 1,
        totalScore: 8,
        highScore: 8,
        averageScore: 4,
        displayName: 'Alice',
      }),
    });
    setDoc.mockResolvedValue();

    await updatePlayerStats('alice-uid', 5, 13, true, 'Alice');

    expect(setDoc).toHaveBeenCalledWith(
      'mockRef',
      expect.objectContaining({
        totalGamesPlayed: 3,
        totalGamesWon: 2,
        totalScore: 13,
        highScore: 13,
      }),
      { merge: true }
    );
  });

  it('does not increment wins on a loss', async () => {
    doc.mockReturnValue('mockRef');
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        totalGamesPlayed: 3,
        totalGamesWon: 2,
        totalScore: 10,
        highScore: 10,
        averageScore: 3.3,
        displayName: 'Alice',
      }),
    });
    setDoc.mockResolvedValue();

    await updatePlayerStats('alice-uid', 0, 0, false, 'Alice');

    expect(setDoc).toHaveBeenCalledWith(
      'mockRef',
      expect.objectContaining({
        totalGamesPlayed: 4,
        totalGamesWon: 2, // unchanged
        totalScore: 10,   // unchanged since roundScore is 0
      }),
      { merge: true }
    );
  });

  it('updates highScore only when session score exceeds existing high score', async () => {
    doc.mockReturnValue('mockRef');
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        totalGamesPlayed: 1,
        totalGamesWon: 1,
        totalScore: 10,
        highScore: 10,
        averageScore: 10,
        displayName: 'Alice',
      }),
    });
    setDoc.mockResolvedValue();

    // session score of 8 is lower than existing highScore of 10
    await updatePlayerStats('alice-uid', 3, 8, true, 'Alice');

    expect(setDoc).toHaveBeenCalledWith(
      'mockRef',
      expect.objectContaining({
        highScore: 10, // should stay at 10, not drop to 8
      }),
      { merge: true }
    );
  });

  it('calculates averageScore correctly', async () => {
    doc.mockReturnValue('mockRef');
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        totalGamesPlayed: 3,
        totalGamesWon: 2,
        totalScore: 12,
        highScore: 6,
        averageScore: 4,
        displayName: 'Alice',
      }),
    });
    setDoc.mockResolvedValue();

    await updatePlayerStats('alice-uid', 4, 4, true, 'Alice');

    expect(setDoc).toHaveBeenCalledWith(
      'mockRef',
      expect.objectContaining({
        totalGamesPlayed: 4,
        totalScore: 16,
        averageScore: 4, // 16 / 4 = 4
      }),
      { merge: true }
    );
  });
});
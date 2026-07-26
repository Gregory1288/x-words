import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

const getWordFactFn = httpsCallable(functions, 'getWordFact');
const getCharacterReactionFn = httpsCallable(functions, 'getCharacterReaction');

export async function fetchWordFact(word) {
  try {
    const result = await getWordFactFn({ word });
    return result.data.fact;
  } catch (err) {
    console.error('Word fact error:', err);
    return null;
  }
}

export async function fetchCharacterReaction(word, outcome, personality, wrongCount) {
  try {
    const result = await getCharacterReactionFn({ word, outcome, personality, wrongCount });
    return result.data;
  } catch (err) {
    console.error('Character reaction error:', err);
    return { line: '...', tone: 'neutral' };
  }
}
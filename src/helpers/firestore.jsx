import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const words = [

  {word: "javascript", category: "technology"},
  {word: "firebase", category: "technology"},
  {word: "hangman", category: "technology"},
  {word: "keyboard", category: "technology"},
  {word: "component", category: "technology"},
  {word: "python", category: "technology"},
  {word: "developer", category: "technology"},
  {word: "database", category: "technology"},
  {word: "function", category: "technology"},
  {word: "variable", category: "technology"},
  {word: "algorithm", category: "technology"},
  {word: "interface", category: "technology"},
  {word: "deployment", category: "technology"},
  {word: "repository", category: "technology"},
  {word: "framework", category: "technology"},

  {word: "elephant", category: "animals"},
  {word: "giraffe", category: "animals"},
  {word: "kangaroo", category: "animals"},
  {word: "dolphin", category: "animals"},
  {word: "penguin", category: "animals"},
  {word: "turtle", category: "animals"},
  {word: "monkey", category: "animals"},

  {word: "pizza", category: "food"},
  {word: "sushi", category: "food"},
  {word: "burger", category: "food"},
  {word: "pasta", category: "food"},
  {word: "salad", category: "food"},
  {word: "steak", category: "food"},
  {word: "icecream", category: "food"},

];

export async function seedWords() {
  const wordsCollection = collection(db, "words");
  for (const wordData of words) {
    await addDoc(wordsCollection, wordData);
  }
  console.log("Words added successfully!");
}

export async function getRandomWord(category) {
  const wordsCollection = collection(db, "words");

  const categoryQuery = query(wordsCollection, where("category", "==", category),);

  const snapshot = await getDocs(categoryQuery);

  const matchingWords = snapshot.docs.map((doc) => doc.data().word);

  if (matchingWords.length === 0) {
    throw new Error("No words found for this category");
  }

  const randomIndex = Math.floor(Math.random() * matchingWords.length);

  return matchingWords[randomIndex];
}

const DAILY_WORD_TIME_ZONE = "Asia/Singapore";

export function getDailyDateKey(date = new Date()) {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: DAILY_WORD_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = dateParts.find((part) => part.type === "year")?.value;
  const month = dateParts.find((part) => part.type === "month")?.value;
  const day = dateParts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export async function getDailyWord(dateKey = getDailyDateKey()) {
  const dailyWordRef = doc(db, "dailyWords", dateKey);
  const dailyWordSnapshot = await getDoc(dailyWordRef);

  if (!dailyWordSnapshot.exists()) {
    throw new Error("No daily word prepared for today.");
  }

  const dailyWordData = dailyWordSnapshot.data();

  if (!dailyWordData.word || !dailyWordData.category || !dailyWordData.difficulty) {
    throw new Error("Today's daily word document is incomplete.");
  }

  return {
    id: dailyWordSnapshot.id,
    ...dailyWordData,
  }
}

/**
 * Checks whether the signed-in player has already completed the daily word.
 */
export async function getDailyAttempt(userId, dateKey = getDailyDateKey()) {
  if (!userId) {
    return null;
  }

  const attemptRef = doc(db, "dailyWords", dateKey, "attempts", userId);
  const attemptSnapshot = await getDoc(attemptRef);

  if (!attemptSnapshot.exists()) {
    return null;
  }

  return {
    id: attemptSnapshot.id,
    ...attemptSnapshot.data(),
  }
}

export async function saveDailyAttempt({userId, displayName, dateKey = getDailyDateKey(), result, wrongGuesses, completionTimeSeconds, score}) {
  if (!userId) {
    throw new Error("The player must be signed in to save a Daily Word attempt.");
  }

  const attemptRef = doc(db, "dailyWords", dateKey, "attempts", userId);
  await setDoc(attemptRef, {
    userId,
    displayName: displayName || "Anonymous Player",
    dateKey,
    result,
    won: result === "win",
    wrongGuesses,
    completionTimeSeconds,
    score,
    completedAt: serverTimestamp(),
  });
}

export async function getDailyLeaderboard(dateKey = getDailyDateKey()) {
  const attemptsCollection = collection(db, "dailyWords", dateKey, "attempts");
  const attemptsSnapshot = await getDocs(attemptsCollection);
  const attempts = attemptsSnapshot.docs.map(
    (attemptDocument) => ({
      id: attemptDocument.id,
      ...attemptDocument.data(),
    })
  )

  return attempts.sort((firstAttempt, secondAttempt) => {
    const firstWon = firstAttempt.won === true || firstAttempt.result === "win";
    const secondWon = secondAttempt.won === true || secondAttempt.result === "win";

    if (firstWon !== secondWon) {
      return Number(secondWon) - Number(firstWon);
    }

    const scoreDifference = (secondAttempt.score ?? 0) - (firstAttempt.score ?? 0);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    const wrongGuessDifference = (firstAttempt.wrongGuesses ?? 0) - (secondAttempt.wrongGuesses ?? 0);

    if (wrongGuessDifference !== 0) {
      return wrongGuessDifference;
    }
    
    return ((firstAttempt,completionTimeSeconds ?? Infinity) - (secondAttempt.completionTimeSeconds ?? Infinity));
  })
  .slice(0, 10);
}

export async function updatePlayerStats(userId, roundScore, sessionScore, won, displayName) {
  const statsRef = doc(db, 'playerStats', userId);
  const statsSnap = await getDoc(statsRef);

  const existing = statsSnap.exists() ? statsSnap.data() : {
    totalGamesPlayed: 0,
    totalGamesWon: 0,
    averageScore: 0,
    totalScore: 0,
    highScore: 0,
    displayName: displayName || '',
  };

  const totalGamesPlayed = existing.totalGamesPlayed + 1;
  const totalGamesWon = existing.totalGamesWon + (won ? 1 : 0);
  const totalScore = existing.totalScore + roundScore;
  const averageScore = totalGamesPlayed ? totalScore / totalGamesPlayed : 0;
  const highScore = Math.max(existing.highScore || 0, sessionScore);

  await setDoc(statsRef, {
    totalGamesPlayed,
    totalGamesWon,
    averageScore,
    totalScore,
    highScore,
    displayName: displayName || existing.displayName || '',
  }, { merge: true });
}
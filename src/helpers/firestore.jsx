import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc, setDoc } from "firebase/firestore";

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

export async function updatePlayerStats(userId, roundScore, won) {
  const statsRef = doc(db, 'playerStats', userId)
  const statsSnap = await getDoc(statsRef)

  const existing = statsSnap.exists() ? statsSnap.data() : {
    totalGamesPlayed: 0,
    totalGamesWon: 0,
    averageScore: 0,
    totalScore: 0,
  }

  const totalGamesPlayed = existing.totalGamesPlayed + 1
  const totalGamesWon = existing.totalGamesWon + (won ? 1 : 0)
  const totalScore = existing.totalScore + roundScore
  const averageScore = totalGamesPlayed ? totalScore / totalGamesPlayed : 0

  await setDoc(statsRef, {
    totalGamesPlayed,
    totalGamesWon,
    averageScore,
    totalScore,
  }, { merge: true })
}
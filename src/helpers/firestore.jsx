import { db } from "../firebase";
import { collection, addDoc, getDocs} from "firebase/firestore";

const words = [
  "javascript", "firebase", "hangman", "keyboard", "component",
  "python", "developer", "database", "function", "variable",
  "algorithm", "interface", "deployment", "repository", "framework"
];

export async function seedWords() {
  const wordsCollection = collection(db, "words");
  for (const word of words) {
    await addDoc(wordsCollection, { word });
  }
  console.log("done");
}

export async function getRandomWord() {
  const snapshot = await getDocs(collection(db, "words"));
  const words = snapshot.docs.map(doc => doc.data().word);
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}
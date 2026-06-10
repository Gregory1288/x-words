# X-Words

## Milestone 1 Submission

**Team Name:** Hangers  
**Proposed Level of Achievement:** Apollo 11

---

## Motivation

Like most people, we grew up playing minigames such as Hangman, scribbling blank dashes on the back of notebooks and guessing letters one by one during class. It is one of those timeless games that needs nothing more than a pen and a piece of paper, yet somehow manages to be genuinely tense and fun every single time.

Taking that experience and bringing it into the browser felt like a natural way to preserve that simplicity while making it accessible to anyone with an internet connection, no pen required.

Beyond nostalgia, Hangman is also a surprisingly effective way to engage with vocabulary and spelling in a low-pressure environment. Unlike flashcards or drills, the game wraps learning inside a challenge, where players are not just reading a word, but actively reconstructing it letter by letter.

By pulling words from a Firestore database, the game can be expanded over time with themed word sets, difficulty tiers, and subject-specific vocabulary, making it useful for students and language learners beyond just casual play.

Finally, this project allows us to explore real-world web development with React, Firebase, and Vite. A leaderboard with authentication, AI-powered fun facts after each round, and a clean responsive UI become meaningful features because there is a real game driving them.

The goal is to ship something that feels polished and genuinely playable, while learning the tools that power production web applications today.

---

## Vision

We aim to develop a fully browser-playable word-guessing game inspired by Hangman that is easy to pick up, visually engaging, and enjoyable across both desktop and mobile browsers.

The game will feature:

- A clean and responsive UI
- Varied word categories
- Different game modes
- Difficulty settings
- Satisfying visual feedback
- AI-generated fun facts after each round
- Leaderboard and player progression features

Our goal is not only to recreate the classic Hangman experience, but also to make it more replayable and meaningful for modern players.

Ultimately, we hope to create a web game that combines nostalgia, challenge, learning, and replayability. We want players to feel the suspense when they hesitate to pick a letter, the satisfaction after solving a word, and the motivation to keep playing for higher scores.

---

## User Stories

1. As a casual player who wants a quick and entertaining brain teaser, I want to be able to start a new word-guessing game immediately without any sign-up or setup.

2. As a student learning English vocabulary, I want to be able to select a word category so that I can practise words relevant to my studies.

3. As a competitive player who wants to challenge myself, I want to be able to choose a difficulty level so that the complexity matches my skill level.

4. As a player who wants to track my progress, I want to be able to see my streaks and high scores so that I feel motivated to keep improving.

5. As a player who dislikes traditional Hangman imagery, I want to be able to see an alternative visual progression such as an animated character so that the game feels fresh and appropriate.

6. As a player on a mobile device, I want to be able to play the game comfortably on my phone browser so that I can enjoy it on the go.

7. As a competitive player, I want to be able to view a leaderboard so that I can compare my performance with other players.

8. As a casual mini-game player, I want to see short fun facts about different words so that I can learn something interesting after playing.

---

## User Profiling

| Motivation | Focus Area |
|---|---|
| Quick entertainment and mental stimulation | A fast, browser-playable game that users can start immediately without sign-up or setup |
| Enjoyment of challenge and progression | Difficulty levels, streaks, high scores, and leaderboard features that encourage repeated play |
| Learning vocabulary in a fun and low-pressure way | Word categories, AI-generated fun facts, and varied word sets that make learning feel natural and engaging |

---

## Features

### 1. Word Guessing Gameplay  
**Status:** Done, refinement needed

The core of the application is built around the classic word-guessing mechanic. A word is chosen at random from the database and represented on screen as blank dashes. The player's goal is to uncover the word by guessing one letter at a time before running out of attempts.

When the game begins, the player sees:

- The hidden word as blank spaces
- A visual Hangman-style progression
- An on-screen keyboard
- Wrong guesses
- Score feedback
- Win/loss popup

Currently, players can interact with the game using physical keyboard input. We plan to add clickable on-screen keyboard support so that the game is easier to play on mobile devices.

Each guess produces one of two outcomes:

- If the guessed letter exists in the word, all matching blanks are revealed.
- If the guessed letter is incorrect, it is added to the wrong guesses list and the figure progresses.

The game also includes a notification system that alerts players when they try to guess a letter they have already submitted.

The game ends in one of two ways:

- If the player successfully guesses the word, a victory popup appears and points are added.
- If the player runs out of attempts, a loss popup appears, the correct word is shown, and the score resets.

The scoring system rewards careful guesses. Each word gives a score calculated based on the number of incorrect guesses made. The score carries across consecutive wins, creating a continuous run where every mistake matters.

---

### 1a. Word Categories and Difficulty System  
**Status:** In Progress

Words are organised into categories instead of being drawn from a single pool. Players can select a category based on their interests or mood.

Possible categories include:

- Animals
- Geography
- Technology
- Food
- General knowledge

Categories are stored in Firestore alongside each word as a field in the document. When a player selects a category, the application queries Firestore for matching words and randomly selects one.

The difficulty system works together with categories. Players can choose between:

- Easy
- Medium
- Hard

Easy mode gives players more attempts, while medium and hard modes reduce the number of attempts allowed. This makes each round more challenging and replayable.

---

### 2. Account System  
**Status:** In Progress

Players can create an account using email and password or sign in quickly using Google through Firebase Authentication.

Without an account, players can still enjoy the core word-guessing gameplay as guests. However, registered users gain access to additional features such as:

- Leaderboard
- Player statistics
- Daily word tracking
- Character selection
- Saved scores

Each user’s data is stored in Firestore under their Firebase Auth user ID, ensuring that statistics, preferences, and scores are tied to the correct account.

---

### 2a. Player Statistics  
**Status:** Planned

Every registered player will have a dedicated statistics profile that updates automatically after each game.

Statistics tracked may include:

- Total games played
- Total games won
- Current win streak
- Longest win streak
- Average score per game
- Total cumulative score

When a game ends, the application updates the player’s Firestore document. A win increases the relevant statistics, while a loss resets the current streak.

---

### 3. Synchronised Leaderboard  
**Status:** Planned

The synchronised leaderboard turns the application from a solo word game into a shared competitive experience.

The leaderboard will display registered players ranked by score in real time. It will be built using Firestore’s real-time listener system, allowing updates to appear immediately without requiring users to refresh the page.

Each leaderboard entry may display:

- Rank
- Display name
- Selected character
- Current cumulative score

When a player wins, their score is updated in Firestore. When they lose, their score resets to zero and the leaderboard updates immediately.

---

### 4. Character Selection  
**Status:** In Progress

The character selection system allows players to choose a character that represents them during gameplay.

Instead of using only the traditional Hangman stick figure, players can select characters that replace or enhance the visual progression. These characters are cosmetic and do not affect gameplay mechanics.

Characters may be divided into:

- Default characters
- Unlockable characters

Unlockable characters can be earned through gameplay milestones, such as:

- Reaching a certain cumulative score
- Achieving a specific win streak
- Completing a number of games in a category

Each character will be stored as a Firestore document containing its name, visual asset reference, and unlock condition.

---

### 5. Game Modes  
**Status:** In Progress

To keep the experience fresh, the game will offer several different modes built around the core Hangman formula.

---

### 5a. Classic Mode  
**Status:** In Progress

Classic Mode is the standard Hangman experience. Players try to uncover a hidden word by guessing letters one at a time.

Each incorrect guess brings the player closer to losing. Categories and difficulty levels allow players to customise the challenge.

Classic Mode serves as the foundation of the game.

---

### 5b. Timed Mode  
**Status:** Planned

Timed Mode adds time pressure to the game. A countdown timer begins as soon as the word is shown, and players must solve the word before time runs out.

Success depends not only on guessing the word, but also on guessing it quickly.

The faster a player solves the word, the higher their score.

---

### 5c. Survival Mode  
**Status:** Additional

Survival Mode focuses on endurance. Players are given a limited number of lives and must solve as many words as possible before running out.

Each completed word leads directly into the next challenge, with difficulty gradually increasing as the run continues.

---

### 6. Daily Word  
**Status:** Planned

Daily Word provides a fresh challenge every day by giving all players the same word.

Unlike normal modes where words are selected randomly, the daily word is predetermined and shared across the entire player base for that day.

Each player is only allowed one completed attempt per day. Performance may be measured using:

- Completion status
- Number of incorrect guesses
- Completion time
- Overall score

The Daily Word system will use Firestore to store the daily word, category, difficulty, word fact, and date. Player submissions will also be stored in Firestore to prevent duplicate attempts and maintain leaderboard integrity.

---

### 7. AI-Powered Word Facts and Hints  
**Status:** Planned

After successfully solving a word, players will be shown an interesting fact related to the word.

These facts may cover:

- History
- Origin
- Cultural significance
- Scientific background
- Surprising uses
- Trivia

Instead of relying only on a fixed database, the system may use a Generative AI API to generate concise and relevant facts based on the selected word and category.

Hints may also be AI-powered through generated trivia questions related to the word.

---

### 7a. Explain Like I’m Five Mode  
**Status:** Additional

Explain Like I’m Five Mode is an optional learning feature that rewrites word facts in simpler language.

This makes the facts more accessible to younger players or users unfamiliar with the topic.

The AI can simplify the explanation using:

- Shorter sentences
- Familiar vocabulary
- Simple examples
- Relatable comparisons

---

### 7b. Character Reactions  
**Status:** Additional

Different playable characters may have unique AI-generated reactions or comments about discovered words.

This gives each character a more distinct personality and makes the game feel more lively.

---

## Timeline and Development Plan

| Milestone | Task | Description | In-Charge | Date |
|---|---|---|---|---|
| 1 | Project setup | Set up the React + Vite project structure, install dependencies, organise folders, and connect the project to GitHub. | Wei Yi, Arthur | 18 May - 23 May |
| 1 | Basic game logic | Implement hidden word display, letter guessing, correct/wrong guesses, and win/loss detection. | Wei Yi | 24 May - 27 May |
| 1 | Basic UI layout | Create the main game screen with word blanks, keyboard/buttons, remaining guesses, and game status messages. | Wei Yi, Arthur | 28 May - 31 May |
| 1 | Word database setup | Set up Firestore database to store words, categories, and difficulty levels. | Wei Yi | 31 May |
| 1 | Game Result Screen | Show win/loss result, correct word, score, and option to start another round. | Arthur | 31 May |
| 2 | Difficulty system | Add easy, medium, and hard difficulty settings. | Wei Yi | 2 June |
| 2 | Authentication | Implement optional sign-in so users can save scores and leaderboard records. | Wei Yi | 3 June - 6 June |
| 2 | Character Selection | Replace traditional Hangman imagery with an alternative animated character or visual feedback system. | Arthur | 7 June - 11 June |
| 2 | Game Modes | Add and implement different game modes for users to choose from. | Wei Yi | 12 June - 16 June |
| 2 | Category Selection | Allow users to choose word categories before starting a round. | Arthur | 17 June - 20 June |
| 2 | Player Statistics | Track player streaks and high scores locally or through user accounts. | Wei Yi | 21 June - 23 June |
| 2 | Leaderboard | Display player rankings based on score, streak, or completed games. | Wei Yi | 24 June - 29 June |
| 3 | AI fun facts | Generate or display fun facts related to the guessed word after each round. | TBD | TBD |
| 3 | Responsive design | Optimise the interface for desktop and mobile browsers. | TBD | TBD |
| 3 | PWA exploration | Explore progressive web app features such as installability and improved mobile experience. | TBD | TBD |
| 3 | Testing and bug fixing | Test gameplay flow, database fetching, authentication, mobile layout, and edge cases. | TBD | TBD |
| 3 | Final polish and documentation | Improve UI consistency, update README, prepare demo video, poster, and final submission materials. | TBD | TBD |

---

## Tech Stack

- React
- Vite
- Firebase Authentication
- Firestore Database
- GitHub

---

## Current Progress

Completed:

- Basic project setup
- Core word-guessing gameplay
- Basic UI layout
- Firestore word database setup
- Game result screen
- Basic scoring system

In Progress:

- Word categories
- Difficulty system
- Account system
- Character selection
- Game modes

Planned:

- Player statistics
- Real-time leaderboard
- Daily Word challenge
- AI-powered word facts and hints
- Responsive design improvements
- PWA exploration
- Final testing and polish

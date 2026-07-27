function CategorySelection({
    selectedMode,
    setSelectedMode,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    goToCharacterSelection,
    onDailyWord,
    dailyWordLoading,
    isSignedIn,
}) {
    return (
        <div className="category-selection">
            <div className="daily-word-card">
                <h2>Daily Word Challenge</h2>

                <p>
                    Everyone receives the same word today. Complete it once and compare your result with othe players.
                </p>

                <button
                    type="button"
                    className="daily-word-button"
                    onClick={onDailyWord}
                    disabled={dailyWordLoading}
                >
                    {dailyWordLoading
                        ? "Checking today's word..."
                        : "Play Daily Word"}
                </button>

                {!isSignedIn && (
                    <p className="daily-word-sign-in-note">
                        Sign in is required to play the Daily Word.
                    </p>
                )}
            </div>

            <div className="selection-divider">
                <span>OR play a regular game</span>
            </div>

            <h2>Select a Game Mode</h2>

            <div className="mode-buttons">
                <button
                    type="button"
                    onClick={() => setSelectedMode("classic")}
                    className={selectedMode === "classic" ? "selected-mode" : ""}
                >
                    Classic
                </button>

                <button
                    type="button"
                    onClick={() => setSelectedMode("timed")}
                    className={selectedMode === "timed" ? "selected-mode" : ""}
                >
                    Timed
                </button>
            </div>

            <h2>Select a Category</h2>

            <div className="category-buttons">
                <button
                    type="button"
                    onClick={() => setSelectedCategory("technology")}
                    className={selectedCategory === "technology" ? "selected-category" : ""}
                >
                    Technology
                </button>

                <button
                    type="button"
                    onClick={() => setSelectedCategory("animals")}
                    className={selectedCategory === "animals" ? "selected-category" : ""}
                >
                    Animals
                </button>

                <button
                    type="button"
                    onClick={() => setSelectedCategory("food")}
                    className={selectedCategory === "food" ? "selected-category" : ""}
                >
                    Food
                </button>
            </div>

            <h2>Select Difficulty</h2>

            <div className="difficulty-buttons">
                <button
                    type="button"
                    onClick={() => setSelectedDifficulty("easy")}
                    className={selectedDifficulty === "easy" ? "selected-difficulty" : ""}
                >
                    Easy
                </button>

                <button
                    type="button"
                    onClick={() => setSelectedDifficulty("medium")}
                    className={selectedDifficulty === "medium" ? "selected-difficulty" : ""}
                >
                    Medium
                </button>

                <button
                    type="button"
                    onClick={() => setSelectedDifficulty("hard")}
                    className={selectedDifficulty === "hard" ? "selected-difficulty" : ""}
                >
                    Hard
                </button>
            </div>

            <button
                className="start-game-button"
                onClick={goToCharacterSelection}
                disabled={!selectedMode ||!selectedCategory || !selectedDifficulty}
            >
                Next
            </button>
        </div>
    );
}

export default CategorySelection;
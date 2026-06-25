function CategorySelection({
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    startGame,
}) {
    return (
        <div className="category-selection">
            <h2>Select a Category</h2>

            <div className="category-buttons">
                <button
                    onClick={() => setSelectedCategory("technology")}
                    className={selectedCategory === "technology" ? "selected-category" : ""}
                >
                    Technology
                </button>

                <button
                    onClick={() => setSelectedCategory("animals")}
                    className={selectedCategory === "animals" ? "selected-category" : ""}
                >
                    Animals
                </button>

                <button
                    onClick={() => setSelectedCategory("food")}
                    className={selectedCategory === "food" ? "selected-category" : ""}
                >
                    Food
                </button>
            </div>

            <h2>Select Difficulty</h2>

            <div className="difficulty-buttons">
                <button
                    onClick={() => setSelectedDifficulty("easy")}
                    className={selectedDifficulty === "easy" ? "selected-difficulty" : ""}
                >
                    Easy
                </button>

                <button
                    onClick={() => setSelectedDifficulty("medium")}
                    className={selectedDifficulty === "medium" ? "selected-difficulty" : ""}
                >
                    Medium
                </button>

                <button
                    onClick={() => setSelectedDifficulty("hard")}
                    className={selectedDifficulty === "hard" ? "selected-difficulty" : ""}
                >
                    Hard
                </button>
            </div>

            <button
                className="start-game-button"
                onClick={startGame}
                disabled={!selectedCategory || !selectedDifficulty}
            >
                Start Game
            </button>
        </div>
    );
}

export default CategorySelection;
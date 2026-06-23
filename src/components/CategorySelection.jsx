function CategorySelection({
    selectedCategory,
    setSelectedCategory,
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

            <button
                className="start-game-button"
                onClick={startGame}
                disabled={!selectedCategory}
            >
                Start Game
            </button>
        </div>
    );
}

export default CategorySelection;
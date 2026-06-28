import {characters} from '../config/characterConfig';

function CharacterSelection({ 
    selectedCharacter,
    setSelectedCharacter,
    startGame,
    goBack,
}) {
    return (
        <div className="character-selection">
            <h2>Select a Character</h2>

            <div className="character-grid">
                {characters.map((character) => (
                    <button
                        key={character.id}
                        className={
                            selectedCharacter === character.id 
                            ? "character-card selected-character"
                            : "character-card"
                        }
                        onClick={() => setSelectedCharacter(character.id)}
                    >
                        <img 
                            src={character.image} 
                            alt={character.name}
                            className="character-card-image" 
                        />
                        <p>{character.name}</p>
                    </button>
                ))}
            </div>

            <div className="character-actions">
                <button className="secondary-button" onClick={goBack}>
                    Back
                </button>

                <button
                    className="start-game-button"
                    onClick={startGame}
                    disabled={!selectedCharacter}
                >
                    Start Game
                </button>
            </div>
        </div>
    );
}

export default CharacterSelection;
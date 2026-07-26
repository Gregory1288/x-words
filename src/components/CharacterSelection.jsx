import { characters } from '../config/characterConfig';
import { isCharacterUnlocked } from '../helpers/unlocks';

function CharacterSelection({ 
    selectedCharacter,
    setSelectedCharacter,
    startGame,
    goBack,
    title = "Select a Character",
    startButtonText = "Start Game",
    subtitle = "",
    playerStats,
}) {
    return (
        <div className="character-selection">
            <h2>{title}</h2>
            
            {subtitle && (
                <p className="character-selection-subtitle">
                    {subtitle}
                </p>
            )}

            <div className="character-grid">
                {characters.map((character) => {
                    const unlocked = isCharacterUnlocked(character, playerStats);

                    return (
                        <button
                            type="button"
                        key={character.id}
                            className={`character-card
                                ${selectedCharacter === character.id ? 'selected-character' : ''}
                                ${!unlocked ? 'locked-character' : ''}
                            `}
                            onClick={() => unlocked && setSelectedCharacter(character.id)}
                            disabled={!unlocked}
                        >
                            {unlocked ? (
                                <>
                                    <img
                                        src={character.image}
                                        alt={character.name}
                                        className="character-card-image"
                                    />
                                    <p>{character.name}</p>
                                </>
                            ) : (
                                <>
                                    <div className="character-locked-placeholder">🔒</div>
                                    <p className="character-card-name">{character.name}</p>
                                    <p className="locked-label">{character.unlockCondition.description}</p>
                                </>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="character-actions">
                <button type="button" className="secondary-button" onClick={goBack}>
                    Back
                </button>

                <button
                    type="button"
                    className="start-game-button auth-button"
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
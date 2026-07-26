import React from 'react'

const Figure = ({ selectedCharacterData, reaction, showReaction }) => {
  const tone = showReaction && reaction?.tone ? reaction.tone : '';
  const line = reaction?.line || '...';

  const currentSprite = tone && selectedCharacterData?.spriteMap?.[tone]
    ? selectedCharacterData.spriteMap[tone]
    : selectedCharacterData?.image;

  return (
    <div className="figure-container">
      <div className="character-with-bubble">
        <img
          src={currentSprite}
          alt={selectedCharacterData?.name}
          className="character-image"
        />
        <div className={`speech-bubble ${tone ? `tone-${tone}` : ''}`}>
          <p>{line}</p>
          <div className="speech-bubble-tail" />
        </div>
      </div>
      <p className="character-name">{selectedCharacterData?.name}</p>
    </div>
  );
}

export default Figure;
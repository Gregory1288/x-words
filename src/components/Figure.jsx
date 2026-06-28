import React from 'react'

const Figure = ({ selectedCharacterData }) => {
  if (!selectedCharacterData) return null;

  return (
    <div className="figure-container">
      <img 
        src={selectedCharacterData.image} 
        alt={selectedCharacterData.name} 
        className="character-image" 
      />
      <p className="character-name">{selectedCharacterData.name}</p>
    </div>
  )
}

export default Figure
import { useState, useEffect } from 'react'

const CharacterReaction = ({ character, reaction, isVisible }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!reaction?.line) return
    setIsTyping(true)
    setDisplayedText('')

    let i = 0
    const interval = setInterval(() => {
      setDisplayedText(reaction.line.slice(0, i + 1))
      i++
      if (i >= reaction.line.length) {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [reaction])

  if (!character) return null

  return (
    <div className="character-container">

      {isVisible && reaction?.line && (
        <div className={`speech-bubble tone-${reaction.tone}`}>
          <p>{displayedText}{isTyping ? '|' : ''}</p>
          <div className="speech-bubble-tail" />
        </div>
      )}

      <div className={`character-sprite tone-${reaction?.tone || 'neutral'}`}>
        <img
          src={character.spriteMap?.[reaction?.tone] || character.defaultSprite}
          alt={character.name}
        />
      </div>

    </div>
  )
}

export default CharacterReaction
export function isCharacterUnlocked(character, playerStats) {
  if (!character.unlockCondition) return true; 
  
  const { type, value } = character.unlockCondition;
  
  if (!playerStats) return false; // not logged in
  
  switch (type) {
    case 'highScore':
      return (playerStats.highScore || 0) >= value;
    case 'totalGamesWon':
      return (playerStats.totalGamesWon || 0) >= value;
    case 'currentStreak':
      return (playerStats.currentStreak || 0) >= value;
    default:
      return false;
  }
}
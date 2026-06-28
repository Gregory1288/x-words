import fullHeart from '../assets/hearts-full.png';
import emptyHeart from '../assets/hearts-empty.png';

function HeartDisplay({ maxWrongGuesses, wrongLetters }) {
  const remainingHearts = Math.max(
    maxWrongGuesses - wrongLetters.length, 0
  );
  return (
    <div className="hearts-container">
      {Array.from({ length: maxWrongGuesses }, (_, index) => (
        <img
          key={index}
          src={index < remainingHearts ? fullHeart : emptyHeart}
          alt={index < remainingHearts ? "Remaining life" : "Lost life"}
          className="heart-icon"
        />
      ))}
    </div>
  );
}

export default HeartDisplay;
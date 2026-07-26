export function showNotification(setter) {
  setter(true);
  setTimeout(() => {
    setter(false);
  }, 2000);
}

export function checkWin(correct, wrong, word, maxWrongGuesses, timedOut = false) {
  let status = 'win';

  // Check for win
  word.split('').forEach(letter => {
    if(!correct.includes(letter)){
      status = '';
    }
  });
  
  // Check for lose
  if(wrong.length >= maxWrongGuesses || timedOut) status = 'lose';

  return status;
}
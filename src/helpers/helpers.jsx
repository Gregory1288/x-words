export function showNotification(setter) {
  setter(true);
  setTimeout(() => {
    setter(false);
  }, 2000);
}

export function checkWin(correct, wrong, word, maxWrongGuesses) {
  let status = 'win';

  // Check for win
  word.split('').forEach(letter => {
    if(!correct.includes(letter)){
      status = '';
    }
  });
  
  // Check for lose
  if(wrong.length >= maxWrongGuesses) status = 'lose';

  return status;
}
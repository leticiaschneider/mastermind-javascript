// General Variables
const colors = ['#ED7788', '#7192be', '#7ab975', '#f4ed39', '#f5ac6a']; // Color palette
const codeLength = 4;
const repetitions = 6;
const boardSection = document.querySelector('.board'); // Select the board
const codeSelected = {}; // Store user guesses
const secretCode = generateCode(); // Generate secret code
console.log(secretCode);
let hasGuessedCorrectly = false;

// -------- Constants for feedback --------
const FEEDBACK_COLORS = {
  correct: 'black',
  wrongPosition: 'white',
};

// -------- Button Event Listeners --------
const undoButton = document.getElementById('undo_button');
const guessButton = document.getElementById('guess_button');
const resetButton = document.getElementById('reset_button');

if (undoButton) {
  undoButton.addEventListener('click', handleUndoClick);
} else {
  console.error('Button "#undo_button" not found in the DOM.');
}

if (guessButton) {
  guessButton.addEventListener('click', handleGuessClick);
} else {
  console.error('Button "#guess_button" not found in the DOM.');
}

if (resetButton) {
  resetButton.addEventListener('click', handleResetClick);
} else {
  console.error('Button "#resetButton" not found in the DOM.');
}

// -------- Color Selection Setup --------
const colorsContainer = document.querySelector('.colorsToSelect');

if (colorsContainer && !hasGuessedCorrectly) {
  colors.forEach(color => {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.style.backgroundColor = color;
    circle.addEventListener('click', () => handleCircleClick(color));
    colorsContainer.appendChild(circle);
  });
} else {
  console.error('Container ".colorsToSelect" not found in the DOM.');
}

// -------- Board Creation --------
for (let i = 0; i < repetitions; i++) {
  const boardGuess = createBoardGuess();
  boardGuess.classList.add(`guess-${repetitions - i}`);
  boardSection.appendChild(boardGuess);

  if (i < repetitions - 1) {
    const hr = document.createElement('hr');
    hr.style.margin = '20px 0';
    hr.style.color = '#fff';
    boardSection.appendChild(hr);
  }
}

updateActiveGuess("guess-1");

// -------- Modal Setup --------
const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('howToPlayModal');

if (openModal && closeModal && modal) {
  openModal.addEventListener('click', () => (modal.style.display = 'block'));
  closeModal.addEventListener('click', () => (modal.style.display = 'none'));
  window.addEventListener('click', event => {
    if (event.target === modal) modal.style.display = 'none';
  });
}

// -------- Function Definitions --------

/**
 * Generate a random secret code.
 * @returns {string[]} Array of colors representing the code.
 */
function generateCode() {
  return Array.from({ length: codeLength }, () => colors[Math.floor(Math.random() * colors.length)]);
}

/**
 * Handle clicks on color circles.
 * @param {string} color - Selected color.
 */
function handleCircleClick(color) {
  const nGuess = Object.keys(codeSelected).length;
  const currentGuessKey = `guess-${nGuess + 1}`;

  if (nGuess > 0) {
    const lastGuessKey = `guess-${nGuess}`;

    if (codeSelected[lastGuessKey].length >= codeLength) return;

    codeSelected[lastGuessKey].push(color);
    fillCircles(lastGuessKey);
    return;
  }

  if (!codeSelected[currentGuessKey]) {
    codeSelected[currentGuessKey] = [color];
    fillCircles(currentGuessKey);
  }
}

/**
 * Fill the circles with selected colors.
 * @param {string} key - Current guess key.
 */
function fillCircles(key) {
  const lineGuess = document.getElementsByClassName(key);
  if (lineGuess.length > 0) {
    const circles = lineGuess[0].getElementsByClassName('circle');
    for (let i = 0; i < circles.length; i++) {
      circles[i].style.backgroundColor = codeSelected[key][i] || '';
    }
  }
}

/**
 * Handle guess submission.
 */
function handleGuessClick() {
  const nGuess = Object.keys(codeSelected).length;
  const lastGuessKey = `guess-${nGuess}`;

  if (!codeSelected[lastGuessKey] || codeSelected[lastGuessKey].length < codeLength) {
    alert('Complete the current guess with 4 colors!');
    return;
  }

  const feedback = getFeedback(codeSelected[lastGuessKey], secretCode);
  fillFeedbackCircles(lastGuessKey, feedback);
  if (feedback.filter(item => item === "black").length == 4) {
    alert("Well done! You've cracked the code!");
    hasGuessedCorrectly = true;
    return;
  }


  if (nGuess < repetitions && !hasGuessedCorrectly) {
    const nextGuessKey = `guess-${nGuess + 1}`;
    codeSelected[nextGuessKey] = [];
    updateActiveGuess(nextGuessKey);
  } else {
    alert('Game Over! You\'ve used all attempts.');
  }
}

/**
 * Generate feedback for the current guess.
 * @param {string[]} guess - User guess.
 * @param {string[]} code - Secret code.
 * @returns {string[]} Feedback array.
 */
function getFeedback(guess, code) {
  const feedback = [];
  const usedIndices = new Set();

  // Correct positions
  guess.forEach((color, index) => {
    if (code[index] === color) {
      feedback.push(FEEDBACK_COLORS.correct);
      usedIndices.add(index);
    }
  });

  // Correct colors, wrong positions
  guess.forEach((color, guessIndex) => {
    if (
      code.includes(color) &&
      !usedIndices.has(guessIndex) &&
      code.findIndex((c, i) => c === color && !usedIndices.has(i)) !== -1
    ) {
      feedback.push(FEEDBACK_COLORS.wrongPosition);
      usedIndices.add(code.findIndex((c, i) => c === color && !usedIndices.has(i)));
    }
  });

  return feedback;
}

/**
 * Fill feedback circles based on feedback.
 * @param {string} key - Current guess key.
 * @param {string[]} feedback - Feedback array.
 */
function fillFeedbackCircles(key, feedback) {
  const lineGuess = document.getElementsByClassName(key);
  if (lineGuess.length > 0) {
    const feedbackCircles = lineGuess[0].getElementsByClassName('grid-of-circles')[0].getElementsByClassName('circle');
    for (let i = 0; i < feedbackCircles.length; i++) {
      feedbackCircles[i].style.backgroundColor = feedback[i] || '';
      if (feedback[i] === FEEDBACK_COLORS.wrongPosition) {
        feedbackCircles[i].style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
      }
    }
  }
}

/**
 * Undo the last color selection.
 */
function handleUndoClick() {
  const nGuess = Object.keys(codeSelected).length;
  const lastGuessKey = `guess-${nGuess}`;

  if (nGuess >= 6 || hasGuessedCorrectly) {
    return;
  }

  if (codeSelected[lastGuessKey]?.length > 0) {
    codeSelected[lastGuessKey].pop();
    fillCircles(lastGuessKey);
  }
}

/**
 * Create a board guess element.
 * @returns {HTMLElement} Board guess element.
 */
function createBoardGuess() {
  const boardGuess = document.createElement('div');
  boardGuess.classList.add('board_guess');

  const arrow = document.createElement('div');
  arrow.classList.add('arrow');
  boardGuess.appendChild(arrow);

  // Line of circles
  const lineOfCircles = document.createElement('div');
  lineOfCircles.classList.add('line-of-circles');
  for (let i = 0; i < codeLength; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    lineOfCircles.appendChild(circle);
  }
  boardGuess.appendChild(lineOfCircles);

  // Grid of circles for feedback
  const gridOfCircles = document.createElement('div');
  gridOfCircles.classList.add('grid-of-circles');
  for (let i = 0; i < codeLength; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    gridOfCircles.appendChild(circle);
  }
  boardGuess.appendChild(gridOfCircles);

  return boardGuess;
}

/**
 * Updates the active guess on the board by toggling the 'active-guess' class.
 * 
 * @param {string} nGuess - The class name of the current guess to activate.
 */
function updateActiveGuess(nGuess) {
  const allGuesses = document.querySelectorAll('.board_guess');
  allGuesses.forEach(guess => guess.classList.remove('active-guess'));

  const currentGuess = document.querySelector(`.${nGuess}`);
  if (currentGuess) {
    currentGuess.classList.add('active-guess');
  }
}

function handleResetClick() {
  updateActiveGuess("guess-1");
}
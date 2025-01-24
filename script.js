
// General Variables
const colors = ['#ED7788', '#7192be', '#7ab975', '#f4ed39', '#f5ac6a']; // Color palette
const codeLength = 4;
const boardSection = document.querySelector('.board'); // Select the board
const repetitions = 6;
const codeSelected = {};
const secretCode = generateCode();

// -------- Defining button event listener --------
const undoButton = document.getElementById('undo_button');
const guessButton = document.getElementById('guess_button');

if (undoButton) {
  undoButton.addEventListener('click', () => {
    handleUndoClick();
  });
} else {
  console.error('Button "#undo_button" not found in the DOM.');
}

if (guessButton) {
  guessButton.addEventListener('click', () => {
    handleGuessClick();
  });
} else {
  console.error('Button "#guess_button" not found in the DOM.');
}

// -------- Defining selectable colors --------
const colorsContainer = document.querySelector('.colorsToSelect'); // Select the container

if (colorsContainer) {
  colors.forEach(color => {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.style.backgroundColor = color;

    circle.addEventListener('click', () => {
      handleCircleClick(color);
    });

    colorsContainer.appendChild(circle);
  });
} else {
  console.error('Container ".colors" not found in the DOM.');
}


// -------- Creating board --------
const createBoardGuess = () => {
  const boardGuess = document.createElement('div');
  boardGuess.classList.add('board_guess');

  // Line of circles
  const lineOfCircles = document.createElement('div');
  lineOfCircles.classList.add('line-of-circles');
  for (let i = 0; i < 4; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    lineOfCircles.appendChild(circle);
  }
  boardGuess.appendChild(lineOfCircles);

  // Grid of circles
  const gridOfCircles = document.createElement('div');
  gridOfCircles.classList.add('grid-of-circles');
  for (let i = 0; i < 4; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    gridOfCircles.appendChild(circle);
  }
  boardGuess.appendChild(gridOfCircles);

  return boardGuess;
};

for (let i = 0; i < repetitions; i++) {

  const boardGuess = createBoardGuess();
  boardGuess.classList.add(`${repetitions - i}guess`);
  boardSection.appendChild(boardGuess);

  if (i < repetitions - 1) {
    const hr = document.createElement('hr');
    hr.style.marginBottom = '20px';
    hr.style.marginTop = '20px';
    hr.style.color = '#fff';
    boardSection.appendChild(hr);
  }
}

// -------- Modal --------
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const modal = document.getElementById("howToPlayModal");

// Open modal
openModal.addEventListener("click", () => {
  modal.style.display = "block";
});

// Close modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal when clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});


// -------- generate a random code --------
function generateCode() {
  return Array.from({ length: codeLength }, () => colors[Math.floor(Math.random() * colors.length)]);
}

// -------- save code selected  --------
function handleCircleClick(color) {
  let nGuess = Object.keys(codeSelected).length;
  let currentGuessKey = `${nGuess + 1}guess`;

  if (nGuess > 0) {
    let lastGuessKey = `${nGuess}guess`;

    if (codeSelected[lastGuessKey].length >= 4) {
      return;
    }

    if (codeSelected[lastGuessKey].length < 4) {
      codeSelected[lastGuessKey].push(color);
      fillCircles(lastGuessKey);
      return;
    }
  }

  if (!codeSelected[currentGuessKey]) {
    codeSelected[currentGuessKey] = [];
    codeSelected[currentGuessKey].push(color);
    fillCircles(currentGuessKey);
  }
}

function fillCircles(key) {
  const lineGuess = document.getElementsByClassName(key);

  if (lineGuess.length > 0) {
    const circles = lineGuess[0].getElementsByClassName('circle');

    for (let i = 0; i < circles.length; i++) {
      if (codeSelected[key][i]) {
        circles[i].style.backgroundColor = codeSelected[key][i];
      } else {
        circles[i].style.backgroundColor = '';
      }
    }
  }
}

function handleGuessClick() {
  let nGuess = Object.keys(codeSelected).length;
  let lastGuessKey = `${nGuess}guess`;

  if (nGuess === 0 || !codeSelected[lastGuessKey] || codeSelected[lastGuessKey].length < 4) {
    alert("Complete the current guess with 4 colors!");
    return;
  }

  const feedback = getFeedback(codeSelected[lastGuessKey], secretCode);
  fillFeedbackCircles(lastGuessKey, feedback);
  
  if (nGuess < repetitions) {
    const nextGuessKey = `${nGuess + 1}guess`;
    codeSelected[nextGuessKey] = [];
  } else {
    alert("Game Over! You've used all attempts.");
  }
}

function getFeedback(guess, code) {
  const feedback = [];
  const usedIndices = new Set();

  guess.forEach((color, index) => {
    if (code[index] === color) {
      feedback.push("black");
      usedIndices.add(index);
    }
  });

  guess.forEach((color, guessIndex) => {
    if (
      code.includes(color) &&
      !usedIndices.has(guessIndex) &&
      code.findIndex((c, i) => c === color && !usedIndices.has(i)) !== -1
    ) {
      feedback.push("white");
      usedIndices.add(code.findIndex((c, i) => c === color && !usedIndices.has(i)));
    }
  });

  return feedback;
}

function fillFeedbackCircles(key, feedback) {
  const lineGuess = document.getElementsByClassName(key);
  if (lineGuess.length > 0) {
    const feedbackCircles = lineGuess[0].getElementsByClassName("grid-of-circles")[0].getElementsByClassName("circle");

    for (let i = 0; i < feedbackCircles.length; i++) {
      if (feedback[i]) {
        feedbackCircles[i].style.backgroundColor = feedback[i] === "black" ? "black" : "white";

        if (feedbackCircles[i].style.backgroundColor === "white") {
          feedbackCircles[i].style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";
        }

      } else {
        feedbackCircles[i].style.backgroundColor = "";
      }
    }
  }
}

function handleUndoClick() {
  let nGuess = Object.keys(codeSelected).length;

  if (nGuess > 0) {
    let lastGuessKey = `${nGuess}guess`;

    if (codeSelected[lastGuessKey].length > 0) {
      codeSelected[lastGuessKey].pop();
      fillCircles(lastGuessKey);
    }
  }
}

// General Variables
const colors = ['red', 'blue', 'green', 'yellow', 'orange']; // Color palette
const codeLength = 4;
const boardSection = document.querySelector('.board'); // Select the board
const repetitions = 6;
const codeSelected = {};

// -------- Defining selectable colors --------
const colorsContainer = document.querySelector('.colorsToSelect'); // Select the container

// Ensure the container exists
if (colorsContainer) {
  // Dynamically create the circles
  colors.forEach(color => {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.style.backgroundColor = color;

    circle.addEventListener('click', () => {
      handleCircleClick(color);
    });

    colorsContainer.appendChild(circle); // Add each circle to the container
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
      circles[i].style.backgroundColor = codeSelected[key][i];
    }
  }
}

// Color palette
const colors = ['red', 'blue', 'green', 'yellow', 'orange'];


// -------- Defining selectable colors --------
// Select the container
const colorsContainer = document.querySelector('.colorsToSelect');

// Ensure the container exists
if (colorsContainer) {
    // Dynamically create the circles
    colors.forEach(color => {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.backgroundColor = color;
        colorsContainer.appendChild(circle); // Add each circle to the container
    });
} else {
    console.error('Container ".colors" not found in the DOM.');
}


// -------- Creating board --------
const boardSection = document.querySelector('.board'); // Select the board
const repetitions = 6;

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
    boardSection.appendChild(boardGuess);
    
    if (i < repetitions - 1) {
        const hr = document.createElement('hr');
        hr.style.marginBottom = '20px';
        hr.style.marginTop = '20px';
        boardSection.appendChild(hr);
    }
}

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
const codeLength = 4;

function generateCode() {
  return Array.from({ length: codeLength }, () => colors[Math.floor(Math.random() * colors.length)]);
}
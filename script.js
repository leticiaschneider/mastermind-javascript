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


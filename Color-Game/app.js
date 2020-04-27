var numSquares = 6;
var colors = [];
var pickedColor;
var messageDisplay = document.querySelector('#message');
var colorDisplay = document.getElementById('colorDisplay');
var h1 = document.querySelector('header');
var resetButton = document.querySelector('#reset');
var squares = document.querySelectorAll('.square');
var modeBtns = document.querySelectorAll('.mode');

init();

function init() {
    setUpModeButtons();
    setUpSquares();
    reset();
}

function setUpModeButtons() {
    for (var i = 0; i < modeBtns.length; i++) {
        modeBtns[i].addEventListener('click', function() {
            modeBtns[0].classList.remove("selected");
            modeBtns[1].classList.remove("selected");
            this.classList.add("selected");
            this.textContent === "Easy" ? numSquares = 3 : numSquares = 6;
            reset();
        });
    }
}

function setUpSquares() {
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.backgroundColor = colors[i];
        squares[i].addEventListener('click', function() {
            var clickedColor = this.style.backgroundColor;
            if (clickedColor === pickedColor) {
                messageDisplay.textContent = "Correct !";
                changedColor(clickedColor);
                h1.style.backgroundColor = clickedColor;
                resetButton.textContent = "Play Again ?"
            } else {
                this.style.backgroundColor = "rgb(29, 23, 23)";
                messageDisplay.textContent = "Try Again";
            }
        });
    }
}

function reset() {
    colors = generateRandomColors(numSquares);
    pickedColor = pickColor();
    colorDisplay.textContent = pickedColor;
    h1.style.backgroundColor = "rgb(79, 113, 224)";
    messageDisplay.textContent = "";
    resetButton.textContent = "New Colors";
    for (var i = 0; i < squares.length; i++) {
        if (colors[i]) {
            squares[i].style.display = "block";
            squares[i].style.backgroundColor = colors[i];
        } else {
            squares[i].style.display = "none";
        }
    }
}
resetButton.addEventListener('click', function() {
    reset();
});


function changedColor(color) {
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.backgroundColor = color;
    }
}

function pickColor() {
    var random = Math.floor(Math.random() * colors.length);
    return colors[random];
}

function generateRandomColors(num) {
    var arr = [];
    for (var i = 0; i < num; i++) {
        arr.push(randomColor());
    }
    return arr;
}

function randomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return "rgb(" + r + ", " + g + ", " + b + ")";
}
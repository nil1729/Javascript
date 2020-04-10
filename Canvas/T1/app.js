const canvas = document.querySelector('#canvas');
console.log(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');


const maxRadius = 40;
const minRadius = 5;

var mouse = {
    x: undefined,
    y: undefined
}
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    // console.log(mouse);
});

var colorArray = [
    'red',
    'blue',
    'black',
    'green',
    'tomato'
]

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius
    this.color = colorArray[Math.floor(Math.random() * 5)];

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.stroke();
        // c.fillStyle = 'black';
        c.fill();
    }

    this.update = () => {
        if (this.x + this.radius >= innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        // interactivity
        if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y > 50 && this.y > -50) {
            if (this.radius < maxRadius) {
                this.radius += 1;
            }

        } else if (this.radius > minRadius) {
            this.radius -= 1;
        }

        this.draw();
    }
}

var circleArray = [];

for (let i = 0; i < 300; i++) {
    var radius = Math.random() * 3 + 1;
    var x = Math.random() * (window.innerWidth - radius * 2) + radius;
    var dx = (Math.random() - 0.5) * 5;
    var y = Math.random() * (window.innerHeight - radius * 2) + radius;
    var dy = (Math.random() - 0.5) * 5;

    circleArray.push(new Circle(x, y, dx, dy, radius));
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
}

animate();
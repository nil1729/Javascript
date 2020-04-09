const sounds = document.querySelectorAll('.sound');
const pads = document.querySelectorAll('.pads div');
const visual = document.querySelector('.visual');
const colors = ["#60d394", "#d36060", "#c060d3", "#d3d160", "#6860d3", "#60b2d3"];
// Lets get going with the sound here
pads.forEach((pad, index) => {

    pad.addEventListener('click', () => {
        for (let i = 0; i < pads.length; i++) {
            if (i != index) {
                sounds[i].pause();
            }
        }
        sounds[index].currentTime = 0;
        sounds[index].play();
        createBubble(index);
    });
});

// Make Bubbles function:
const createBubble = index => {
    const bubble = document.createElement('div');
    visual.appendChild(bubble);
    bubble.style.backgroundColor = colors[index];
    bubble.style.animation = 'jump 1s ease';
    bubble.addEventListener('animationend', () => {
        visual.removeChild(bubble);
    })
};
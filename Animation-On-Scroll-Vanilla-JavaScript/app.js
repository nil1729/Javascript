const left = document.querySelectorAll("#left-slide");
const right = document.querySelectorAll("#right-slide");

document.addEventListener('scroll', () => {
    for (let item of left) {
        if (item.getBoundingClientRect().top < document.documentElement.clientHeight / 1.5) {
            item.style.animation = "slide-in 1s ease forwards"
        }
    }
    for (let item of right) {
        if (item.getBoundingClientRect().top < document.documentElement.clientHeight / 1.5) {
            item.style.animation = "slide-in 1s ease forwards"
        }
    }
});
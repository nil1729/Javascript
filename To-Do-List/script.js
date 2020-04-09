const clear = document.querySelector('.clear');
const dateElement = document.querySelector('#date');
const list = document.querySelector('#list');
const input = document.querySelector('#input');
const plusItem = document.querySelector('.plus-item');
const header = document.querySelector('.header');

// Classes Names:
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

// Variables
let LIST = [];
let id = 0;

// get item from the local storage
let data = localStorage.getItem("TODO");

// check if data is not empty;
if (data) {
    LIST = JSON.parse(data);
    id = LIST.length; // set the id to the length of the list
    loadList(LIST); // load the list to the USER INTERFACE 
} else {
    // if data isn't empty;
    LIST = [];
    id = 0;
}

// loaditems to the user's interface
function loadList(array) {
    array.forEach((item) => {
        addToDo(item.name, item.id, item.done, item.trash);
    });
}

// clear the localStorage
clear.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

// add item to localstorage (this code must be added everywhere where the LIST array is updated)
localStorage.setItem("TODO", JSON.stringify(LIST));

// Show Todays date:
const options = { weekday: "long", month: "short", day: "numeric" };
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-US", options);

// add to do functions

function addToDo(toDo, id, done, trash) {
    if (trash) {
        return;
    }

    const DONE = done ? CHECK : UNCHECK;

    const LINE = done ? LINE_THROUGH : "";



    const item = `<li class="item">
                        <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                        <p class="text ${LINE}">${toDo}</p>
                        <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                </li>`;
    const position = "beforeend";
    list.insertAdjacentHTML(position, item);
}

// add an item to the list user the enter key

document.addEventListener('keyup', (event) => {
    if (event.keyCode == 13) {
        const toDo = input.value;
        // if the input isn't empty
        if (toDo) {
            addToDo(toDo, id, false, false);
            LIST.push({
                name: toDo,
                id: id,
                done: false,
                trash: false
            });
        }
        id++;
        input.value = "";
        // add item to localstorage (this code must be added everywhere where the LIST array is updated)
        localStorage.setItem("TODO", JSON.stringify(LIST));
    }
});

plusItem.addEventListener('click', () => {
    const toDo = input.value;
    // if the input isn't empty
    if (toDo) {
        addToDo(toDo, id, false, false);
        LIST.push({
            name: toDo,
            id: id,
            done: false,
            trash: false
        });
    }
    id++;
    input.value = "";
    // add item to localstorage (this code must be added everywhere where the LIST array is updated)
    localStorage.setItem("TODO", JSON.stringify(LIST));
});

// Complete to do
function completeToDo(element) {
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
}

// remove to do
function removeToDo(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true;
}

// target the items created dynamically
list.addEventListener('click', (event) => {
    const element = event.target;
    console.log(element.classList[0]);
    if (element.classList[0] === 'text' || element.classList[0] === 'item') {
        return;
    } else {
        const elementJob = element.attributes.job.value;

        if (elementJob == 'complete') {
            completeToDo(element);
        } else if (elementJob == "delete") {
            removeToDo(element);
        }
    }
    // add item to localstorage (this code must be added everywhere where the LIST array is updated)
    localStorage.setItem("TODO", JSON.stringify(LIST));
});

window.onload = () => {
    let randomNumber = Math.floor(Math.random() * 5 + 1);
    header.style.backgroundImage = `url('./img/${randomNumber}.jpg')`
}

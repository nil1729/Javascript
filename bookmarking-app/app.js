const siteName = document.querySelector('#site-name');
const siteAddress = document.querySelector('#site-address');
const submitBtn = document.querySelector('.submit-btn');
const errorMsg = document.getElementById('error-msg');
const errorDiv = document.querySelector('.error-div');
const listDiv = document.querySelector('.list-group');
const closeBtn = document.querySelector('.close');

window.onload = () => {
    updateUI();
};
closeBtn.addEventListener('click', resetForm);
submitBtn.addEventListener('click', () => {
    const webName = siteName.value;
    const webAdress = siteAddress.value;
    resetForm();
    let errors = '';
    if (webName == '' || webAdress == '') {
        errors += '<p class="text-center">Site Name or Site Address cannot be remain blank</p>';
    }
    if (webName.length < 6) {
        errors += '<p class="text-center">Site Name should have atleast 6 characters</p>';
    }
    if (webName.length > 15) {
        errors += '<p class="text-center">Site Name should have atmost 15 characters</p>';
    }
    if (found1(webName).length > 0) {
        errors += `<p class="text-center">Site Name already Exists with <br>URL: ${found1(webName)[0].url}</p> `;
    }
    if (found2(webAdress).length > 0) {
        errors += `<p class="text-center">Site Address already Exists with <br>Site Name: <em>${found2(webAdress)[0].name}</em></p> `;
    }
    if (!validURL(webAdress)) {
        errors += '<p class="text-center">Site URL is not valid</p>';
    }
    if (errors) {
        errorDiv.classList.remove('sr-only');
        errorMsg.innerHTML = errors;
        return;
    }
    createList(webName, webAdress);
});

function resetForm() {
    errorDiv.classList.add('sr-only');
    siteName.value = '';
    siteAddress.value = '';
}

function createList(wn, wa) {
    let data = loadData();
    data.unshift({ name: wn, url: wa });
    saveData(data);
    updateUI();
}

function found1(wn) {
    let data = loadData();
    const duplicate = data.filter(site => site.name == wn);
    return duplicate;
}

function found2(wa) {
    let data = loadData();
    const duplicate = data.filter(site => site.url == wa);
    return duplicate;
}

function updateUI() {
    let data = loadData();
    listDiv.innerHTML = '';
    data.forEach(site => {
        listDiv.innerHTML += `
    <li class="list-group-item my-2">
                <div class="row">
                    <h4 class="col-md-8">${site.name}</h4>
                    <div class="col-md-4">
                        <button class="btn btn-primary"><a target="_blank" href="${site.url}" class="text-white">Visit</a> </button>
                        <button class="btn btn-danger ml-4 deleteBtn">Delete</button>
                    </div>
                </div>
            </li>
    `;
    });
    const dltBtns = document.querySelectorAll('.deleteBtn');
    deleteSite(dltBtns, data);
}

function deleteSite(dltBtns, data) {
    for (let i = 0; i < dltBtns.length; i++) {
        dltBtns[i].addEventListener('click', () => {
            const deletedSite = dltBtns[i].parentElement.parentElement.children;
            const found = data.find(site => site.name == deletedSite[0].textContent);
            data = data.filter(site => site !== found);
            saveData(data);
            updateUI();
        });
    }
}

function saveData(data) {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("Bookmarks", JSON.stringify(data));
    } else {
        alert("Your Browser do not Supported Local Storage");
    }
}

function loadData() {
    const data = localStorage.getItem('Bookmarks');
    return JSON.parse(data);
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}
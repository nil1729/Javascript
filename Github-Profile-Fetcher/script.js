const avatar = document.querySelector('.user-avatar');
const bio = document.querySelector('.user-bio');
const name = document.querySelector('.user-name');
const repo = document.querySelector('.user-repo');
const followers = document.querySelector('.user-followers');
const btn = document.querySelector('.btn');
const username = document.querySelector('.username');
let gitusername;

let userData = { name: "", bio: "", avatar: "", followers: "", repo: "" };

function resetData() {
    userData = { name: "", bio: "", avatar: "", followers: "", repo: "" };
    avatar.innerHTML = "";
    bio.innerHTML = "";
    name.innerHTML = "";
    repo.innerHTML = "";
    followers.innerHTML = "";
}
btn.addEventListener('click', () => {
    gitusername = username.value;
    username.value = "";
    resetData();
    getData();
});

function getData() {
    let api = `https://api.github.com/users/${gitusername}`;
    fetch(api)
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            console.log(data);
            userData.name = data.name;
            userData.bio = data.bio;
            userData.repo = data.public_repos;
            userData.followers = data.followers;
            userData.avatar = data.avatar_url;
            console.log(data.message);
            if (data.message !== 'Not Found') {
                dispalayData();
            } else {
                dispalayError();
            }
        });

}

function dispalayData() {
    avatar.innerHTML = `<img src="${userData.avatar}" alt="">`
    if (userData.bio !== null) {
        bio.innerHTML = `<p>${userData.bio}</p>`
    } else {
        bio.innerHTML = "";
    }
    if (userData.name !== null) {
        name.innerHTML = `<p>${userData.name}</p>`
    } else {
        name.innerHTML = "";
    }
    repo.innerHTML = `<p>Repositories: ${userData.repo}</p>`
    followers.innerHTML = `<p>Followers: ${userData.followers}</p>`
}

function dispalayError() {
    avatar.innerHTML = `<img src="404.png" alt="">`;
    name.innerHTML = `<p>404 Not Found</p>`
}
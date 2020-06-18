const usernameInput = document.getElementById('username-input');
const searchForm = document.getElementById('search-form');
async function fetchAccountInfo(username) {
    if (!username) return;
    const url = `https://api.github.com/users/${username}`
    const response = await fetch(url);
    const result = await response.json()
    if (!result.message) {
        console.table(result);
        displayUserData(result);
    } else {
        displayError();
    }
}
async function fetchRepos(username) {
    if (!username) return;
    const url = `https://api.github.com/users/${username}/repos`
    const response = await fetch(url);
    const result = await response.json()
    document.getElementById('repos-list').innerHTML = '';
    if (!result.message) {
        console.table(result);
        result.forEach(repo => {
            displayRepo(repo)
        })
    } else {
        displayError();
    }
}
function displayContentDiv() {
    document.getElementById('content').style.display = '';
    document.getElementById('error').style.display = 'none';
}
function displayError() {
    document.getElementById('content').style.display = 'none';
    document.getElementById('error').style.display = '';
}
function displayRepo(data) {
    const { name, created_at } = data;
    const item = document.createElement('li');
    item.appendChild(document.createTextNode(`${name} - Created at: ${parseDate(created_at)}`));
    document.getElementById('repos-list').appendChild(item);

}
function displayUserData(data) {
    displayContentDiv();
    const { login, avatar_url, public_repos, followers, following, created_at } = data;
    document.getElementById('username').innerText = login;
    document.getElementById('avatar').src = avatar_url;
    document.getElementById('public-repos').innerText = `Public repos: ${public_repos}`;
    document.getElementById('followers').innerText = `Followers: ${followers}`;
    document.getElementById('followings').innerText = `Followings: ${following}`;
    document.getElementById('created-at').innerText = `Created at: ${parseDate(created_at)}`;
}
function parseDate(date) {
    d = new Date(date);
    return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
}
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetchAccountInfo(usernameInput.value);
    fetchRepos(usernameInput.value);
})

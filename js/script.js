const DEBUG = false;

const usernameInput = document.getElementById('username-input');
const searchForm = document.getElementById('search-form');
const backButton = document.getElementById('back-btn');
async function fetchUsers(searchQuery) {
    if (!searchQuery) return;
    const url = `https://api.github.com/search/users?q=${searchQuery}`
    const response = await fetch(url);
    const result = await response.json();
    displayOnly('users')
    document.getElementById('users').innerHTML = '';
    if (result.message) return;
    const { items } = result;
    if (items.length == 0) {
        displayOnly('error');
        return;
    }
    items.forEach(user => { displayUserResult(user); });
    setOnClickUserResults();
}
async function fetchUserInfo(username) {
    if (!username) return;
    const url = `https://api.github.com/users/${username}`
    const response = await fetch(url);
    const result = await response.json();
    if (result.message) return;
    displayUserData(result);
}
async function fetchRepos(username) {
    if (!username) return;
    const url = `https://api.github.com/users/${username}/repos`
    const response = await fetch(url);
    const result = await response.json();
    document.getElementById('repos-list').innerHTML = '';

    if (result.message) return;


    result.forEach(repo => { displayRepo(repo); });
}

function displayRepo(data) {
    let { name, created_at, html_url, description, avatar_url, stargazers_count, updated_at } = data;
    created_at = parseDate(created_at);
    updated_at = parseDate(updated_at);
    console.log(data);
    const color = getRandomTailwindColor();
    const opacity = getRandomTailwindOpacity();
    if (!description) description = "No description.";
    document.getElementById('repos-list').innerHTML +=
        `
    <div class='p-10 py-24 text-center w-full md:w-1/2 lg:w-1/3 bg-${color}-${opacity} text-xl p-4 border-gray-400 border'>
        <a href='${html_url}' target='_blank'><img class='mx-4 mb-4 w-16 mx-auto rounded-full' src='images/github1.png'>
            <div>
                <h3 class='text-2xl mb-2'>${name}</h3>
                <h3 class='text-sm mb-2'>${description}</h3>
                <h3 class='text-sm mb-2'>Created at: ${created_at}</h3>
                <h3 class='text-sm'>Stars: ${stargazers_count}</h3>
            </div>
        </a>
    </div>
    `;
}
function displayUserResult(data) {
    const userResultsDiv = document.getElementById('users');
    const { login, avatar_url } = data;
    userResultsDiv.innerHTML +=
        ` <div class='border border-grey-200 cursor-pointer p-4 bg-gray-100 user-item' data-value='${login}'>
            <img src='${avatar_url}' class='w-8 inline mr-4 rounded-full border border-gray-400'>
            <h2 class='inline mr-4'>${login}</h2>
        </div>`;
}
function setOnClickUserResults() {
    const results = document.getElementsByClassName('user-item');
    for (let i = 0; i < results.length; i++) {
        const element = results[i];
        const username = element.dataset.value;
        element.addEventListener('click', () => {
            fetchUserInfo(username);
            fetchRepos(username);
        })
    }
}
function displayUserData(data) {
    displayOnly('content');
    const { name, html_url, avatar_url, public_repos, followers, following, created_at } = data;
    const { bio, location, company } = data;
    let extraInfo = "";
    extraInfo = extraInfo || company;
    extraInfo = extraInfo || location;
    extraInfo = extraInfo || bio;

    document.getElementById('name').innerText = name;
    document.getElementById('extra-info').innerText = extraInfo;
    document.getElementById('profile-url').href = html_url;
    document.getElementById('avatar').src = avatar_url;
    document.getElementById('repositories').innerText = public_repos;
    document.getElementById('followers').innerText = followers;
    document.getElementById('followings').innerText = following;
    document.getElementById('joined-date').innerText = parseDate(created_at);
}

function parseDate(date) {
    return new Date(date).toISOString().split('T')[0];
}
const allId = ['content', 'users', 'error']
function displayOnly(displayId) {
    allId.forEach(id => { hideElement(id); });
    showElement(displayId);
}
function showElement(id) {
    document.getElementById(id).classList.remove('hidden');
}
function hideElement(id) {
    document.getElementById(id).classList.add('hidden');
}
function displayAll() {
    allId.forEach(id => { showElement(id) });
}
function getRandomTailwindColor() {
    const colors = ['red', 'blue', 'gray', 'pink', 'teal', 'green', 'indigo', 'orange', 'purple', 'yellow'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}
function getRandomTailwindOpacity() {
    const opacity = [100, 200]
    const randomIndex = Math.floor(Math.random() * opacity.length);
    return opacity[randomIndex];
}
// MAIN 
if (DEBUG) { displayAll(); hideElement('error') }
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchQuery = usernameInput.value
    fetchUsers(searchQuery);
})
backButton.addEventListener('click', () => { displayOnly('users') });


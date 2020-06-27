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
    const { name, created_at, html_url } = data;
    document.getElementById('repos-list').innerHTML +=
        `
    <div class='p-10 py-24 text-center w-full md:w-1/2 lg:w-1/3 bg-orange-100 text-xl p-4 border-orange-200 border'>
        <a href='${html_url}'><img class='mx-4 mb-4 w-16 mx-auto rounded-full' src='images/github1.png'>
            <div>
                <h3 class='text-2xl mb-2'>${name}</h3>
                <h3 class='text-sm'>${parseDate(created_at)}</h3>
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
            <img src='${avatar_url}' class='w-8 inline mr-4'>
            <h2 class='inline'>${login}</h2>
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
    document.getElementById('name').innerText = name;
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

function displayOnly(displayId) {
    const allId = ['content', 'users', 'error']
    allId.forEach(id => { document.getElementById(id).classList.add('hidden') });
    const visibleElement = document.getElementById(displayId);
    if (visibleElement)
        visibleElement.classList.remove('hidden');
}

// MAIN 
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchQuery = usernameInput.value
    fetchUsers(searchQuery);
})
backButton.addEventListener('click', () => { displayOnly('users') });
if (!DEBUG) { displayOnly('') }

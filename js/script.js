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
    }
}
function displayContentDiv() {
    document.getElementById('content').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
}
function displayError() {
    document.getElementById('content').classList.add('hidden');
    document.getElementById('error').classList.remove('hidden');
}
function displayRepo(data) {
    const { name, created_at, html_url } = data;
    document.getElementById('repos-list').innerHTML +=
        `
    <div class='p-10 py-24 text-center w-full md:w-1/2 lg:w-1/3 bg-orange-100 text-xl p-4 border-orange-200 border'>
        <a href='${html_url}'><img class='mx-4 mb-4 w-16 mx-auto rounded-full' src='images/github1.png'></a>
        <h3 class='text-2xl mb-2'>${name}</h3>
        <h3 class='text-sm'>${parseDate(created_at)}</h3>
    </div>
    `;

}
function displayUserData(data) {
    displayContentDiv();
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
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetchAccountInfo(usernameInput.value);
    fetchRepos(usernameInput.value);
})

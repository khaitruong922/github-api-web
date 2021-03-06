const DEBUG = false
const usernameInput = document.getElementById('username-input')
const searchForm = document.getElementById('search-form')
const backButton = document.getElementById('back-btn')
const allId = ['content', 'users', 'error']
const userURLCreator = (user) => `https://api.github.com/search/users?q=${user}`
const repoURLCreator = (user) => `https://api.github.com/users/${user}/repos`
const userInfoURLCreator = (user) => `https://api.github.com/users/${user}`

async function fetchJson(url) {
    const response = await fetch(url)
    return response.json()
}
async function fetchUsers(searchQuery) {
    if (!searchQuery) return
    const result = await fetchJson(userURLCreator(searchQuery))
    displayOnly('users')
    clearElement('users')
    if (result.message) return
    const { items } = result
    if (items.length == 0) { displayOnly('error'); return }
    items.forEach(user => { displayUserResult(user) })
    setOnClickUserResults()
}
async function fetchUserInfo(username) {
    if (!username) return
    const result = await fetchJson(userInfoURLCreator(username))
    if (result.message) return
    displayUserData(result)
}
async function fetchRepos(username) {
    if (!username) return
    const result = await fetchJson(repoURLCreator(username))
    clearElement('repos-list')
    if (result.message) return
    result.forEach(repo => { displayRepo(repo) })
}
function displayUserResult(data) {
    const userResultsDiv = document.getElementById('users')
    const { login: username, avatar_url } = data
    userResultsDiv.innerHTML +=
        ` <div class='border border-grey-200 cursor-pointer p-4 bg-gray-100 js-user-results' data-username='${username}'>
            <img src='${avatar_url}' class='w-8 inline mr-4 rounded-full border border-gray-400'>
            <h2 class='inline mr-4'>${username}</h2>
        </div>`
}
function displayUserData(data) {
    displayOnly('content')
    const { name, html_url, avatar_url, public_repos, followers, following, created_at } = data
    const { bio, location, company } = data
    let extraInfo = ""
    extraInfo = extraInfo || company
    extraInfo = extraInfo || location
    extraInfo = extraInfo || bio
    document.getElementById('name').innerText = name
    document.getElementById('extra-info').innerText = extraInfo
    document.getElementById('profile-url').href = html_url
    document.getElementById('avatar').src = avatar_url
    document.getElementById('repositories').innerText = public_repos
    document.getElementById('followers').innerText = followers
    document.getElementById('followings').innerText = following
    document.getElementById('joined-date').innerText = parseDate(created_at)
}
function displayRepo(data) {
    let { name, created_at, html_url, description, avatar_url, stargazers_count, updated_at } = data
    created_at = parseDate(created_at)
    updated_at = parseDate(updated_at)
    const color = getRandomTailwindColor()
    const opacity = getRandomTailwindOpacity()
    if (!description) description = "No description."
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
    `
}

function setOnClickUserResults() {
    const userResults = document.getElementsByClassName('js-user-results')
    for (let i = 0; i < userResults.length; i++) {
        const element = userResults[i];
        const username = element.dataset.username
        element.addEventListener('click', () => {
            fetchUserInfo(username)
            fetchRepos(username)
        })
    }
}

function parseDate(date) {
    return new Date(date).toISOString().split('T')[0]
}
function clearElement(id) {
    document.getElementById(id).innerHTML = ''
}
function displayOnly(displayId) {
    hideAll()
    showElement(displayId)
}
function showElement(id) {
    document.getElementById(id).classList.remove('hidden')
}
function hideElement(id) {
    document.getElementById(id).classList.add('hidden')
}
function hideAll() {
    allId.forEach(id => { hideElement(id) })
}
function displayAll() {
    allId.forEach(id => { showElement(id) })
}
function getRandomTailwindColor() {
    const colors = ['red', 'blue', 'gray', 'pink', 'teal', 'green', 'indigo', 'orange', 'purple', 'yellow']
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}
function getRandomTailwindOpacity() {
    const opacity = [100, 200]
    const randomIndex = Math.floor(Math.random() * opacity.length)
    return opacity[randomIndex]
}
// MAIN 
if (DEBUG) { displayAll(); hideElement('error') }
searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchQuery = usernameInput.value
    fetchUsers(searchQuery)
})
backButton.addEventListener('click', () => { displayOnly('users') })
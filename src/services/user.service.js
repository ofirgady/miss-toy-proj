import { storageService } from "./async-storage.service.js"

export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    getEmptyCredentials,
    updateLoggedInUser,
}

const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY = 'userDB'

async function query() {
    return await storageService.query(STORAGE_KEY)
}

async function getById(userId) {
    return await storageService.get(STORAGE_KEY, userId)
}

async function login({ username, password }) {
    const users = await storageService.query(STORAGE_KEY)
    const user = users.find(user => user.username === username)
    if (user) return _setLoggedinUser(user)
    else throw new Error('Invalid login')
}

async function signup({ username, password, fullname }) {
    const user = { 
        username, 
        password, 
        fullname, 
        createdAt: Date.now(), 
        updatedAt: Date.now(), 
        balance: 0, 
        activities: [], 
        prefs: { color: '#000000', bgColor: '#FFFFFF' },
    }
    const savedUser = await storageService.post(STORAGE_KEY, user)
    return _setLoggedinUser(savedUser)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
    const userToSave = { 
        _id: user._id, 
        fullname: user.fullname, 
        balance: user.balance, 
        activities: user.activities, 
        prefs: user.prefs 
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

function getEmptyCredentials() {
    return {
        fullname: '',
        username: 'ofir',
        password: '12345',
    }
}

async function updateLoggedInUser(user) {
    const updatedUser = await storageService.put(STORAGE_KEY, user)
    return _setLoggedinUser(updatedUser)
}
import { userService } from "../../services/user.service.js";
import { SET_IS_LOADING } from "../reducers/toy.reducer.js";
import { SET_USER } from "../reducers/user.reducer.js";
import { store } from "../store.js";

export async function login(credentials) {
    try {
        const user = await userService.login(credentials)
        store.dispatch({ type: SET_USER, user })
    } catch (err) {
        console.error('user actions -> Cannot login', err)
        throw err
    }
}

export async function signup(credentials) {
    try {
        const user = await userService.signup(credentials)
        store.dispatch({ type: SET_USER, user })
    } catch (err) {
        console.error('user actions -> Cannot signup', err)
        throw err
    }
}

export async function logout() {
    try {
        await userService.logout()
        store.dispatch({ type: SET_USER, user: null })
    } catch (err) {
        console.error('user actions -> Cannot logout', err)
        throw err
    }
}

export async function updateUserPrefs(user) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const updatedUser = await userService.updateLoggedInUser(user)
        store.dispatch({ type: SET_USER, user: updatedUser })
    } catch (err) {
        console.error('user actions -> Cannot update user preferences', err)
        throw err
    } finally {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    }
}

export async function updateUser(user) {
    try {
        const updatedUser = await userService.updateLoggedInUser(user)
        store.dispatch({ type: SET_USER, user: updatedUser })
    } catch (err) {
        console.error('user actions -> Cannot update user', err)
        throw err
    }
}
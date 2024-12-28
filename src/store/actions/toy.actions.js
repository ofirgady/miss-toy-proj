import { toyService } from "../../services/toy.service.js";
import { ADD_TOY,SET_TOY, REMOVE_TOY, SET_IS_LOADING, SET_TOYS, UNDO_TOYS, UPDATE_TOY, SET_TOTAL_TOYS, SET_FILTER_BY } from "../reducers/toy.reducer.js";
import { store } from "../store.js";

export function loadToys(filterBy) {

    store.dispatch({ type: SET_IS_LOADING, isLoading: true });
    return toyService.query(filterBy)
        .then(({ toys, totalToys }) => {
            store.dispatch({ type: SET_TOYS, toys });
            store.dispatch({ type: SET_TOTAL_TOYS, totalToys });
        })
        .catch((err) => {
            console.error("toy action -> Cannot load toys", err);
            throw err;
        })
        .finally(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false });
        });
}

export function loadToy(toyId) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    return toyService.get(toyId)
    .then((toy => {
        store.dispatch({ type: SET_TOY, toy })
    }))
    .catch(err => {
        console.log('toy action -> Cannot load toy', err)
        throw err
    })
    .finally(() => {
        store.dispatch({ type: SET_IS_LOADING, isLoading: false })
    })
}

export function removeToy(toyId) {

    return toyService.remove(toyId)
        .then(() => {
            store.dispatch({ type: REMOVE_TOY, toyId })
            store.dispatch({ type: SET_USER, toyId })
        })
        .catch(err => {
            console.log('toy action -> Cannot remove toy', err)
            throw err
        })
}

export function removeToyOptimistic(toyId) {
    store.dispatch({ type: REMOVE_TOY, toyId })
    return toyService.remove(toyId)
        .catch(err => {
            store.dispatch({ type: UNDO_TOYS })
            console.log('toy action -> Cannot remove toy', err)
            throw err
        })
}

export function saveToy(toy) {
    const type = toy._id ? UPDATE_TOY : ADD_TOY
    return toyService.save(toy)
        .then((savedToy) => {
            store.dispatch({ type, toy: savedToy })
            return savedToy
        })
        .catch(err => {
            console.log('toy action -> Cannot save toy', err)
            throw err
        })
}

export function toggleToy(toy) {
    store.dispatch({ type: UPDATE_TOY, toy })
    return toyService.save(toy)
    .then((savedToy) => {
        store.dispatch({ type: UPDATE_TOY, toy: savedToy })
        return savedToy
    })
    .catch(err => {
        console.log('toy action -> Cannot save toy', err)
        throw err
    })
}

export function setFilterBy(filterBy) {
    store.dispatch({ type: SET_FILTER_BY, filterBy })
}

import { toyService } from "../../services/toy.service.js"
import {	SET_TOYS,SET_TOTAL_TOYS,	SET_TOY,REMOVE_TOY,ADD_TOY,UPDATE_TOY,SET_FILTER_BY,SET_IS_LOADING,	UNDO_TOYS} from "../reducers/toy.reducer.js"
import { store } from "../store.js"

export async function loadToys(filterBy) {
	try {
		
		store.dispatch({ type: SET_IS_LOADING, isLoading: true })
		const {toys, totalToys} = await toyService.query(filterBy)
				store.dispatch({ type: SET_TOYS, toys })
				store.dispatch({ type: SET_TOTAL_TOYS, totalToys })
				store.dispatch({ type: SET_IS_LOADING, isLoading: false })
	} catch (error) {		
		console.error("toy action -> Cannot load toys", error)
		throw error
	}
}

export async function loadToy(toyId) {

	try {
		store.dispatch({ type: SET_IS_LOADING, isLoading: true })
		const toy = await toyService.get(toyId)
		store.dispatch({ type: SET_TOY, toy })
		store.dispatch({ type: SET_IS_LOADING, isLoading: false })
	} catch (error) {
		console.error("toy action -> Cannot load toy", error)
		throw error
	}

}

export async function saveToy(toy) {
	try {
		const type = toy._id ? UPDATE_TOY : ADD_TOY
		const savedToy = await toyService.save(toy)
		store.dispatch({ type, toy: savedToy })
		return savedToy
	} catch (error) {
		console.error("toy action -> Cannot save toy", error)
			throw error
	}

}

export async function removeToy(toyId) {
	try {	
		await toyService.remove(toyId)
		store.dispatch({ type: REMOVE_TOY, toyId })
	} catch (error) {
		console.error("toy action -> Cannot remove toy", error)
		throw error
	}
}

export function removeToyOptimistic(toyId) {
	store.dispatch({ type: REMOVE_TOY, toyId })
	return toyService.remove(toyId).catch((err) => {
		store.dispatch({ type: UNDO_TOYS })
		console.error("toy action -> Cannot remove toy", err)
		throw err
	})
}

export function setFilterBy(filterBy) {
	store.dispatch({ type: SET_FILTER_BY, filterBy })
}
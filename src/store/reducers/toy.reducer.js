import { toyService } from "../../services/toy.service"

export const SET_TOYS = "SET_TOYS"
export const SET_TOTAL_TOYS = "SET_TOTAL_TOYS"
export const SET_TOY = "SET_TOY"
export const REMOVE_TOY = "REMOVE_TOY"
export const ADD_TOY = "ADD_TOY"
export const UPDATE_TOY = "UPDATE_TOY"
export const SET_FILTER_BY = "SET_FILTER_BY"
export const SET_IS_LOADING = "SET_IS_LOADING"
export const UNDO_TOYS = "UNDO_TOYS"
export const SET_LABELS = "SET_LABELS"

const initialState = {
	toys: [],
	totalToys: 0,
	filterBy: toyService.getDefaultFilter(),
	isLoading: false,
	lastToys: [],
	toy: toyService.getDefaultToy(), // TODO check to change to null
	labels: [], // New field to store the labels
}

export function toyReducer(state = initialState, cmd = {}) {
	switch (cmd.type) {
		case SET_TOYS:
			return {
				...state,
				toys: cmd.toys,
			}
		case SET_TOTAL_TOYS:
			return {
				...state,
				totalToys: cmd.totalToys,
			}
		case SET_TOY:
			return {
				...state,
				toy: cmd.toy,
			}
		case ADD_TOY:
			return {
				...state,
				toys: [...state.toys, cmd.toy],
			}
		case REMOVE_TOY:
			return {
				...state,
				toys: state.toys.filter((toy) => toy._id !== cmd.toyId),
				lastToys: [...state.toys],
			}
		case UPDATE_TOY:
			return {
				...state,
				toys: state.toys.map((toy) =>
					toy._id === cmd.toy._id ? cmd.toy : toy
				),
			}
		case SET_FILTER_BY:
			return {
				...state,
				filterBy: { ...state.filterBy, ...cmd.filterBy },
			}
		case SET_IS_LOADING:
			return {
				...state,
				isLoading: cmd.isLoading,
			}
		case UNDO_TOYS:
			return {
				...state,
				toys: [...state.lastToys],
			}
		case SET_LABELS:
			return {
				...state,
				labels: cmd.labels,
			}
		default:
			return state
	}
}

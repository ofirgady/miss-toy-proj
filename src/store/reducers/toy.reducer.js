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

const initialState = {
	toys: [],
	totalToys: 0,
	filterBy: toyService.getDefaultFilter(),
	isLoading: false,
	lastToys: [],
	toy: toyService.getDefaultToy(), // Default toy for editing
}

export function toyReducer(state = initialState, action = {}) {
	switch (action.type) {
		case SET_TOYS:
			return {
				...state,
				toys: action.toys,
			}
		case SET_TOTAL_TOYS:
			return {
				...state,
				totalToys: action.totalToys,
			}
		case SET_TOY:
			return {
				...state,
				toy: action.toy,
			}
		case ADD_TOY:
			return {
				...state,
				toys: [...state.toys, action.toy],
			}
		case REMOVE_TOY:
			return {
				...state,
				toys: state.toys.filter((toy) => toy._id !== action.toyId),
				lastToys: [...state.toys],
			}
		case UPDATE_TOY:
			return {
				...state,
				toys: state.toys.map((toy) =>
					toy._id === action.toy._id ? action.toy : toy
				),
			}
		case SET_FILTER_BY:
			return {
				...state,
				filterBy: { ...state.filterBy, ...action.filterBy },
			}
		case SET_IS_LOADING:
			return {
				...state,
				isLoading: action.isLoading,
			}
		case UNDO_TOYS:
			return {
				...state,
				toys: [...state.lastToys],
			}
		default:
			return state
	}
}
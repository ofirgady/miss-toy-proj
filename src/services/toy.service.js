import { storageService } from "./async-storage.service.js"
import { utilService } from "./util.service.js"

export const toyService = {
	query,
	save,
	remove,
	get,
	createToy,
	getDefaultFilter,
	getDefaultToy,
	getFilterFromSearchParams,
	getDynamicLabels,
	getStaticLabels,
}

const STORAGE_KEY = "toysDB"

const predefinedLabels = [
	"On wheels",
	"Box game",
	"Art",
	"Baby",
	"Doll",
	"Puzzle",
	"Outdoor",
	"Battery Powered",
]

_createToys()

async function query(filterBy = {}) {
	try {
		let toys = await storageService.query(STORAGE_KEY)
		const totalToys = toys.length
		if (filterBy.name) {
			const regExp = new RegExp(filterBy.name, "i")
			toys = toys.filter((toy) => regExp.test(toy.name))
		}

		if (filterBy.labels && filterBy.labels.length > 0) {
			toys = toys.filter((toy) =>
				filterBy.labels.every((label) => toy.labels.includes(label))
			)
		}

		if (filterBy.inStock !== "" && filterBy.inStock !== undefined) {
			toys = toys.filter((toy) => toy.inStock === filterBy.inStock)
		}

		if (filterBy.sortBy) {
			const { field } = filterBy.sortBy
			if (field === "createdAt") {
				toys = toys.sort((a, b) => (a[field] < b[field] ? 1 : -1))
			} else {
				toys = toys.sort((a, b) => (a[field] > b[field] ? 1 : -1))
			}
		}

		// if (filterBy.pagination) {
		//     const { currentPage, itemsPerPage } = filterBy.pagination;
		//     const startIdx = (currentPage - 1) * itemsPerPage;
		//     toys = toys.slice(startIdx, startIdx + itemsPerPage);
		// }

		return { toys, totalToys }
	} catch (error) {
		console.log("error:", error)
		throw error
	}
}

function get(id) {
	return storageService.get(STORAGE_KEY, id)
}

function remove(id) {
	return storageService.remove(STORAGE_KEY, id)
}

function save(toy) {
	if (toy._id) {
		return storageService.put(STORAGE_KEY, toy)
	} else {
		return storageService.post(STORAGE_KEY, toy)
	}
}

function createToy(
	name = "Toy",
	price = 100,
	labels = ["Generic"],
	createdAt = Date.now(),
	inStock = true
) {
	return {
		_id: utilService.makeId(),
		name,
		price,
		labels,
		createdAt,
		inStock,
	}
}

function getDefaultFilter() {
	return {
		name: "",
		labels: [],
		inStock: "",
		// pagination: {currentPage: 1, itemsPerPage: 5},
		sortBy: { field: "createdAt", order: "asc" },
	}
}

function getFilterFromSearchParams(searchParams) {
	const defaultFilter = getDefaultFilter()
	const filterBy = {}
	for (const field in defaultFilter) {
		filterBy[field] = searchParams.get(field) || ""
	}
	return filterBy
}

function _createToys() {
	let toys = utilService.loadFromStorage(STORAGE_KEY)
	if (!toys || !toys.length) {
		toys = []
		const toyNames = ["Talking Doll", "Action Figure", "Puzzle Game"]
		for (let i = 0; i < 5; i++) {
			const name = toyNames[i % toyNames.length]
			const randomLabels = _getRandomLabels()
			let toy = createToy(name, 10 + i * 10, randomLabels)
			toys.push(toy)
		}
		utilService.saveToStorage(STORAGE_KEY, toys)
	}
}

function getDefaultToy() {
	return {
		_id: "", // Empty string for new toys
		name: "New Toy",
		price: 100,
		labels: ["Generic"],
		createdAt: Date.now(),
		inStock: true,
		color: "#ffffff", // Default color
	}
}

function getDynamicLabels() {
	return storageService.query(STORAGE_KEY).then((toys) => {
		const labelsSet = new Set()
		toys.forEach((toy) => toy.labels.forEach((label) => labelsSet.add(label)))
		return Array.from(labelsSet)
	})
}

function getStaticLabels() {
	return Promise.resolve([
		"On wheels",
		"Box game",
		"Art",
		"Baby",
		"Doll",
		"Puzzle",
		"Outdoor",
		"Battery Powered",
	])
}

function _getRandomLabels() {
	const labelCount = Math.floor(Math.random() * 3) + 1 // Random count between 1 and 3
	const shuffled = [...predefinedLabels].sort(() => 0.5 - Math.random()) // Shuffle labels
	return shuffled.slice(0, labelCount) // Return a random subset
}

// const toy = {
// 	_id: "t101",
// 	name: "Talking Doll",
// 	price: 123,
// 	labels: ["Doll", "Battery Powered", "Baby"],
// 	createdAt: 1631031801011,
// 	inStock: true,
// }

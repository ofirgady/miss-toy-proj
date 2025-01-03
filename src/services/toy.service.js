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
	getLabels, // Fetches predefined static labels
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

const toyImgUrls = [
    'https://res.cloudinary.com/ofirgady/image/upload/v1735812739/miss_toys/ppsl76k0bt2o1gi7ldmf.png',
    'https://res.cloudinary.com/ofirgady/image/upload/v1735812739/miss_toys/wkowqdngnyniaegg79hg.png',
    'https://res.cloudinary.com/ofirgady/image/upload/v1735812738/miss_toys/wvxaqmfdwlljegnqi1on.png',
    'https://res.cloudinary.com/ofirgady/image/upload/v1735812739/miss_toys/wfj5xup3wusq9i2s9tqb.png',
    'https://res.cloudinary.com/ofirgady/image/upload/v1735812739/miss_toys/byftcerhcdpqc5bcymg3.png'
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

		return { toys, totalToys }
	} catch (error) {
		console.error("Error querying toys:", error)
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
	{name = "Toy",
	price = 100,
	labels = ["Generic"],
	createdAt = Date.now(),
	inStock = true,
    img = ''}
) {
	return {
		_id: utilService.makeId(),
		name,
		price,
		labels,
		createdAt,
		inStock,
        img
	}
}

function getDefaultFilter() {
	return {
		name: "",
		labels: [],
		inStock: "",
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
		const toyNames = ["Robot", "Race Car", "Dinosaur", 'rubber duck', 'Building Blocks']
		for (let i = 0; i < 5; i++) {
			const name = toyNames[i % toyNames.length]
            const img = toyImgUrls[i];
            const price = 10 + i * 10
			const randomLabels = _getRandomLabels()
			let toy = createToy({name, price, labels: randomLabels, img: img})
			toys.push(toy)
		}
		utilService.saveToStorage(STORAGE_KEY, toys)
	}
}

function getDefaultToy() {
	return {
		_id: "",
		name: "New Toy",
		price: 100,
		labels: ["Generic"],
		createdAt: Date.now(),
		inStock: true,
        img:''
	}
}

function getLabels() {
	return Promise.resolve(predefinedLabels)
}

function _getRandomLabels() {
	const labelCount = Math.floor(Math.random() * 3) + 1
	const shuffled = [...predefinedLabels].sort(() => 0.5 - Math.random())
	return shuffled.slice(0, labelCount)
}
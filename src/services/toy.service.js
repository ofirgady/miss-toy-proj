import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const toyService = {
    query,
    save,
    remove,
    getById,
    createToy,
    getDefaultFilter,
    getFilterFromSearchParams
}

const STORAGE_KEY = 'toys'

async function query(filterBy = {}) {
    try {
        
        let toys = await storageService.query(STORAGE_KEY)

        if (filterBy.txt) {
			const regExp = new RegExp(filterBy.txt, "i");
			toys = toys.filter((toy) => regExp.test(toy.txt));
		}

		// if (filterBy.labels) {
		// 	toys = toys.filter((toy) => toy.importance >= filterBy.importance);
		// }

		if (filterBy.inStock !== '' && filterBy.inStock !== undefined) {
			toys = toys.filter((toy) => toy.inStock === filterBy.inStock);
		}

		//  if (filterBy.sortBy) {
        //     const { field, order } = filterBy.sortBy;
		// 	if (field === 'created') {
		// 		toys = toys.sort((a, b) => (a[field] < b[field] ? 1 : -1));
		// 	}
		// 	else {
		// 		toys = toys.sort((a, b) => (a[field] > b[field] ? 1 : -1));
		// 	}
        // }

        // if (filterBy.pagination) {
        //     const { currentPage, itemsPerPage } = filterBy.pagination;
        //     const startIdx = (currentPage - 1) * itemsPerPage;
        //     toys = toys.slice(startIdx, startIdx + itemsPerPage);
        // }

		// return { toys, totalToys };
        return toys
    } catch (error) {
        console.log('error:', error)
        throw error
    }
}

function getById(id) {
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

function createToy(name = '', price = 100, labels = [], createdAt = Date.now(), inStock = true ) {
    const toy = {name, price, labels, createdAt, inStock}
    toy._id = utilService.makeId();
    return toy
}

function getDefaultFilter() {
    return {
        name: '',
        // labels: [],
        inStock: true,
    }
}


function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        filterBy[field] = searchParams.get(field) || ''
    }
    return filterBy
}

function _createToys() {
    let toys = utilService.loadFromStorage(STORAGE_KEY)
    if (!toys || !toys.length) {
        toys = []
        for (let i = 0 ; i < 5 ; i++) {
            let toy = createToy("Talking Doll", 123, ["Doll", "Battery Powered", "Baby"])
            toys.push(toy)
        }
        utilService.saveToStorage(STORAGE_KEY, toys)
    }
}



// const labels = [
// 	"On wheels",
// 	"Box game",
// 	"Art",
// 	"Baby",
// 	"Doll",
// 	"Puzzle",
// 	"Outdoor",
// 	"Battery Powered",
// ]

// const toy = {
// 	_id: "t101",
// 	name: "Talking Doll",
// 	price: 123,
// 	labels: ["Doll", "Battery Powered", "Baby"],
// 	createdAt: 1631031801011,
// 	inStock: true,
// }

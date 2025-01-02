import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import { loadLabels, loadToys, removeToyOptimistic, setFilterBy } from '../store/actions/toy.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { Fragment, useEffect, useRef, useState } from 'react'
import { updateUser } from '../store/actions/user.actions'
import { ToyFilter } from '../cmps/ToyFilter'
import { ToyList } from '../cmps/ToyList'
import { SET_FILTER_BY } from '../store/reducers/toy.reducer'
import { toyService } from '../services/toy.service'
import { getExistingProperties } from '../services/util.service'

export function ToyIndex() {

    const dispatch = useDispatch()
    const toys = useSelector(storeState => storeState.toyModule.toys)
    const filterBy = useSelector(storeState => storeState.toyModule.filterBy)
    const isLoading = useSelector(storeState => storeState.toyModule.isLoading)
	const labels = useSelector((storeState) => storeState.toyModule.labels)
    const [searchParams, setSearchParams] = useSearchParams()
    const [toyToRemove, setToyToRemove] = useState(null)
    const dialogRef = useRef(null)
	

	useEffect(() => {
        setFilterBy(toyService.getFilterFromSearchParams(searchParams))
    }, [])


    useEffect(() => {
		loadToys(filterBy).catch((err) => {
			showErrorMsg('Cannot load toys')
		})
		setSearchParams(getExistingProperties(filterBy))
	}, [filterBy])
	
	useEffect(() => {
        if (!labels.length) {
            loadLabels()
                .catch(() => showErrorMsg('Cannot load labels'));
        }
    }, [labels]);
        
    function onSetFilter(filterBy) {
        setFilterBy(filterBy)
    }

	function handleOpenDialog(toyId) {
		setToyToRemove(toyId)
		dialogRef.current.showModal()
	}

	function handleCloseDialog() {
		dialogRef.current.close()
		setToyToRemove(null)
	}

	// Update the current page
	// function onPageChange(newPage) {
	// 	if (newPage < 1 || newPage > maxPages) return
	// 	const updatedFilterBy = {
	// 		...filterBy,
	// 		pagination: { ...filterBy.pagination, currentPage: newPage },
	// 	}
	// 	dispatch({ type: SET_FILTER_BY, filterBy: updatedFilterBy })
	// }

	// Update items per page
	// function onItemsPerPageChange(newItemsPerPage) {
	// 	const updatedFilterBy = {
	// 		...filterBy,
	// 		pagination: { ...filterBy.pagination, itemsPerPage: newItemsPerPage },
	// 	}
	// 	dispatch({ type: SET_FILTER_BY, filterBy: updatedFilterBy })
	// }

	function onSortChange(field) {
		const newOrder = filterBy.sortBy.order === 'asc' ? 'desc' : 'asc'
		const updatedFilterBy = { ...filterBy, sortBy: { field, order: newOrder } }
		dispatch({ type: SET_FILTER_BY, filterBy: updatedFilterBy })
	}

	function handleConfirmRemove() {
		if (toyToRemove) {
			removeToyOptimistic(toyToRemove)
				.then(() => {
					handleCloseDialog()
					showSuccessMsg(`Toy removed`)
				})
				.catch((err) => {
					showErrorMsg('Cannot remove toy ' + toyToRemove)
				})
		}
	}

	return (
		<section className='toy-index'>
			<ToyFilter
				filterBy={filterBy}
				onSetFilterBy={onSetFilter}
				labels={labels.map((label) => ({ label, value: label }))}
			/>
			<div>
				<Link to='/toy/edit'>
					Add Toy
				</Link>
			</div>
			<h2>Toys List</h2>
			{!isLoading ? (
				<>
					<div className='sorting-controls'>
						<button onClick={() => onSortChange('price')}>
							Sort by Price
						</button>
						<button onClick={() => onSortChange('createdAt')}>
							Sort by time of creation
						</button>
						<button onClick={() => onSortChange('name')}>
							Sort by Name
						</button>
					</div>
					<ToyList
						toys={toys}
						onRemoveToy={handleOpenDialog}
					/>
				</>
			) : (
				<div className='loading-container'>
					<div className='loading'></div>
				</div>
			)}

			{/* Dialog Element */}
			<dialog
				ref={dialogRef}
				className='dialog'>
				<p>Are you sure you want to delete this toy?</p>
				<div>
					<button onClick={handleConfirmRemove}>Yes</button>
					<button onClick={handleCloseDialog}>No</button>
				</div>
			</dialog>
		</section>
	)
}

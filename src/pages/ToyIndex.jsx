import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { loadToys, removeToyOptimistic, setFilterBy } from "../store/actions/toy.actions";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { useEffect, useRef, useState } from "react";
import { ToyFilter } from "../cmps/ToyFilter";
import { ToyList } from "../cmps/ToyList";
import { SET_FILTER_BY } from "../store/reducers/toy.reducer";
import { toyService } from "../services/toy.service";
import { getExistingProperties } from "../services/util.service";

export function ToyIndex() {
	const dispatch = useDispatch();
	const toys = useSelector((storeState) => storeState.toyModule.toys);
	const filterBy = useSelector((storeState) => storeState.toyModule.filterBy);
	const isLoading = useSelector((storeState) => storeState.toyModule.isLoading);
	const [searchParams, setSearchParams] = useSearchParams();
	const [toyToRemove, setToyToRemove] = useState(null);
	const dialogRef = useRef(null);
	const [labelOptions, setLabelOptions] = useState([]);
	const params = useParams();

	useEffect(() => {
		onLoadLabels();
		setFilterBy(toyService.getFilterFromSearchParams(searchParams));
	}, []);

	useEffect(() => {
		loadToysData();
		setSearchParams(getExistingProperties(filterBy));
	}, [filterBy]);

	async function loadToysData() {
		try {
			const filteredToys = await loadToys(params.toyId);
			console.log('Filtered toys:', filteredToys); // Debug log
		} catch (error) {
			showErrorMsg("Cannot load toys");
			console.error(error);
		}
	}

	async function onLoadLabels() {
		try {
			const labels = await toyService.getLabels();
			setLabelOptions(labels);
		} catch (error) {
			showErrorMsg("Cannot load labels");
		}
	}

	function onSetFilter(updatedFilter) {
		if (JSON.stringify(filterBy) !== JSON.stringify(updatedFilter)) {
		  setFilterBy(updatedFilter);
		  console.log(filterBy);
		}
	  }

	function handleOpenDialog(toyId) {
		setToyToRemove(toyId);
		dialogRef.current.showModal();
	}

	function handleCloseDialog() {
		dialogRef.current.close();
		setToyToRemove(null);
	}

	function onSortChange(field) {
		const newOrder = filterBy.sortBy.order === "asc" ? "desc" : "asc";
		const updatedFilterBy = { ...filterBy, sortBy: { field, order: newOrder } };
		dispatch({ type: SET_FILTER_BY, filterBy: updatedFilterBy });
	}

	function handleConfirmRemove() {
		if (toyToRemove) {
			removeToyOptimistic(toyToRemove)
				.then(() => {
					handleCloseDialog();
					showSuccessMsg(`Toy removed`);
				})
				.catch((err) => {
					showErrorMsg("Cannot remove toy " + toyToRemove);
				});
		}
	}

	return (
		<section className="toy-index">
			<ToyFilter filterBy={filterBy} onSetFilterBy={onSetFilter} labels={labelOptions} />
			<div className="index-controls">
				<Link to="/toy/edit" className="primary-btn">
					Add Toy
				</Link>
				<div className="sorting-controls">
					<button className="sort-btn" onClick={() => dispatch(setFilterBy({ ...filterBy, sortBy: { field: "price", order: "asc" } }))}>
						Sort by Price
					</button>
					<button className="sort-btn" onClick={() => dispatch(setFilterBy({ ...filterBy, sortBy: { field: "createdAt", order: "desc" } }))}>
						Sort by Date
					</button>
					<button className="sort-btn" onClick={() => dispatch(setFilterBy({ ...filterBy, sortBy: { field: "name", order: "asc" } }))}>
						Sort by Name
					</button>
				</div>
			</div>
			{isLoading ? (
				<div className="loading-container">
					<div className="loading"></div>
				</div>
			) : (
				<ToyList toys={toys} onRemoveToy={handleOpenDialog} />
			)}
			<dialog ref={dialogRef} className="dialog">
				<p>Are you sure you want to delete this toy?</p>
				<div className="dialog-actions">
					<button className="danger-btn" onClick={handleConfirmRemove}>
						Yes
					</button>
					<button className="secondary-btn" onClick={handleCloseDialog}>
						No
					</button>
				</div>
			</dialog>
		</section>
	);
}
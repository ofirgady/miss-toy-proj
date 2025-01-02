import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import Select from "react-select"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"
import { toyService } from "../services/toy.service"
import { loadToy, saveToy } from "../store/actions/toy.actions"

export function ToyEdit() {
	// Fetching toy and isLoading from the store
	const toy = useSelector((storeState) => storeState.toyModule.toy)
	const isLoading = useSelector((storeState) => storeState.toyModule.isLoading)

	const navigate = useNavigate()
	const params = useParams()

	// Local state for editing toy and labels
	const [toyToEdit, setToyToEdit] = useState(null)
	const [labelOptions, setLabelOptions] = useState([])

	// Load the toy for editing
	useEffect(() => {
		onLoadToy()
	}, [params.toyId])

	async function onLoadToy() {
		try {
			if (params.toyId) {
				await loadToy(params.toyId)
				showSuccessMsg("Toy loaded successfully")
			}
		} catch (error) {
			showErrorMsg("Cannot load toy")
			navigate("/toy")
		}
	}

	// Load labels from the service
	useEffect(() => {
		onLoadLabels()
	}, [])

	async function onLoadLabels() {
		try {
			const labels = await toyService.getLabels()
			setLabelOptions(labels.map((label) => ({ label, value: label })))
		} catch (error) {
			showErrorMsg("Cannot load labels")
		}
	}

	// Sync the toy from the store into local state
	useEffect(() => {
		if (toy) {
			setToyToEdit((prevToy) => ({
				...prevToy,
				...toy,
				toyLabels: toy.labels || [],
			}))
		}
	}, [toy])

	// Handle general input changes
	function handleChange({ target }) {
		const field = target.name
		let value = target.value

		switch (target.type) {
			case "number":
				value = +value || ""
				break
			case "checkbox":
				value = target.checked
				break
			default:
				break
		}

		setToyToEdit((prevToy) => ({ ...prevToy, [field]: value }))
	}

	// Handle MultiSelect input changes
	function handleMultiSelectChange(selectedOptions) {
		const selectedLabels = selectedOptions.map((option) => option.value)
		setToyToEdit((prevToy) => ({ ...prevToy, labels: selectedLabels }))
	}

	// Save the toy
	async function onSaveToy(ev) {
		try {
			ev.preventDefault()
			const savedToy = await saveToy(toyToEdit)
			navigate("/toy")
			showSuccessMsg(`Toy Saved (id: ${savedToy._id})`)
		} catch (error) {
			showErrorMsg("Cannot save toy")
		}
	}

	// Show loading state if still loading
	if (isLoading || !toyToEdit)
		return (
			<div className='loading-container'>
				<div className='loading'></div>
			</div>
		)

	// Destructure toyToEdit properties for form inputs
	const { name, price, inStock, labels, description } = toyToEdit

	return (
		<section className='toy-edit'>
			<form onSubmit={onSaveToy}>
				<label htmlFor='name'>Name:</label>
				<input
					onChange={handleChange}
					value={name}
					type='text'
					name='name'
					id='name'
				/>

				<label htmlFor='price'>Price:</label>
				<input
					onChange={handleChange}
					value={price}
					type='number'
					name='price'
					id='price'
				/>

				<label htmlFor='inStock'>In Stock:</label>
				<input
					onChange={handleChange}
					checked={inStock}
					type='checkbox'
					name='inStock'
					id='inStock'
				/>

				<label htmlFor='description'>Description:</label>
				<textarea
					onChange={handleChange}
					value={description}
					name='description'
					id='description'
				/>

				<label htmlFor='labels'>Labels:</label>
				<Select
					isMulti
					options={labelOptions}
					value={labelOptions.filter((option) => labels.includes(option.value))}
					onChange={handleMultiSelectChange}
					placeholder='Select labels'
				/>

				<button type='submit'>Save</button>
			</form>
		</section>
	)
}

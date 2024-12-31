import { useSelector } from "react-redux"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadLabels, loadToy, saveToy } from "../store/actions/toy.actions.js"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Select from "react-select"

export function ToyEdit() {
	const toy = useSelector((storeState) => storeState.toyModule.toy)
	const navigate = useNavigate()
	const params = useParams()
	const labels = useSelector((storeState) => storeState.toyModule.labels)
	const isLoading = useSelector((storeState) => storeState.toyModule.isLoading)
	const [toyToEdit, setToyToEdit] = useState(toy)
	const [labelOptions, setLabelOptions] = useState([])

	useEffect(() => {
		if (params.toyId) {
			loadToy(params.toyId)
				.then(() => {
					showSuccessMsg(`Toy loaded successfully`)
				})
				.catch(() => {
					showErrorMsg("Cannot load toy")
				})
		} else {
			// Initialize a new toy if no toyId is present
			setToyToEdit({
				name: "",
				price: 0,
				inStock: false,
				toyLabels: [],
				color: "#ffffff",
				description: "",
			})
		}
	}, [params.toyId])

	useEffect(() => {
		if (!labels.length) {
			loadLabels()
				.then((labels) => {
					setLabelOptions(labels.map((label) => ({ label, value: label })))
				})
				.catch(() => {
					showErrorMsg("Cannot load labels")
				})
		} else {
			setLabelOptions(labels.map((label) => ({ label, value: label })))
		}
	}, [labels])

	useEffect(() => {
		if (toy) {
			// Update toyToEdit when toy is loaded
			setToyToEdit((prevToy) => ({
				...prevToy,
				...toy,
				toyLabels: toy.labels || [], // Ensure toyLabels is an array
			}))
		}
	}, [toy])

	function handleChange(eventOrOptions, isMultiSelect = false) {
		if (isMultiSelect) {
			// Handle MultiSelect input
			const selectedLabels = eventOrOptions.map((option) => option.value)
			setToyToEdit((prevToy) => ({ ...prevToy, toyLabels: selectedLabels }))
		} else {
			// Handle regular input
			const { target } = eventOrOptions
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
	}

	function onSaveToy(ev) {
		ev.preventDefault()
		saveToy(toyToEdit)
			.then((savedToy) => {
				navigate("/toy")
				showSuccessMsg(`Toy Saved (id: ${savedToy._id})`)
			})
			.catch(() => {
				showErrorMsg("Cannot save toy")
			})
	}

	const {
        name,
        price,
        inStock,
        toyLabels,
        color,
        description,
    } = toyToEdit;

	if (isLoading)
		return (
			<div className='loading-container'>
				<div className='loading'></div>
			</div>
		)

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

				<label htmlFor='color'>Color:</label>
				<input
					onChange={handleChange}
					value={color}
					type='color'
					name='color'
					id='color'
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
					value={labelOptions.filter((option) =>
						toyLabels.includes(option.value)
					)}
					onChange={(selectedOptions) => handleChange(selectedOptions, true)}
					placeholder='Select labels'
				/>

				<button>Save</button>
			</form>
		</section>
	)
}

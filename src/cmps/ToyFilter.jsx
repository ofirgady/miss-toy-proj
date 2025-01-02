import { useEffect, useState } from "react"
import { MultiSelect } from "react-multi-select-component"

export function ToyFilter({ filterBy, onSetFilterBy, labels }) {
	const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

	useEffect(() => {
		const timeout = setTimeout(() => {
			onSetFilterBy(filterByToEdit)
		}, 400)

		return () => clearTimeout(timeout)
	}, [filterByToEdit])

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

		if (field === "inStock") {
			value = value === "true" ? true : value === "false" ? false : ""
		}

		setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
	}

	function handleMultiSelectChange(eventOrOptions) {
		const selectedLabels = eventOrOptions.map((option) => option.value)
		setFilterByToEdit((prevFilter) => ({
			...prevFilter,
			labels: selectedLabels,
		}))
	}

	const { name, labels: selectedLabels = [], inStock } = filterByToEdit

	return (
		<section className='toy-filter'>
			<h2>Filter Toys</h2>
			<form>
				<input
					value={name}
					onChange={handleChange}
					type='search'
					placeholder='By Name'
					id='name'
					name='name'
				/>

				<label htmlFor='labels'>Labels:</label>
				<MultiSelect
					options={labels.map((label) => ({ label, value: label }))}
					value={selectedLabels.map((label) => ({ label, value: label }))}
					onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, true)}
					labelledBy="Select Labels"
				/>

				<label htmlFor='inStock'>What Toys would you like to see:</label>
				<select
					name='inStock'
					id='inStock'
					onChange={handleChange}
					value={inStock === true ? "true" : inStock === false ? "false" : ""}>
					<option value=''>All</option>
					<option value='true'>In stock</option>
					<option value='false'>Not in stock</option>
				</select>
			</form>
		</section>
	)
}

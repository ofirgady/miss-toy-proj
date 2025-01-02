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

	function handleChange(eventOrOptions, isMultiSelect = false) {
		if (isMultiSelect) {
			// Handle MultiSelect input
			const selectedLabels = eventOrOptions.map((option) => option.value);
            setFilterByToEdit((prevFilter) => ({ ...prevFilter, labels: selectedLabels }));
		} else {
			// Handle regular input
			const { target } = eventOrOptions
			const field = target.name
			let value = target.value

			switch (target.type) {
				case "number":
				case "range":
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
	}

	const { name, selectedLabels = [], inStock } = filterByToEdit

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
					options={labels}
					value={selectedLabels.map((label) => ({ label, value: label }))}
					onChange={(selectedOptions) => handleChange(selectedOptions, true)}
					labelledBy='Select Labels'
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

//     function handleChange({ target }) {
//         const field = target.name
//         let value = target.value
//         switch (target.type) {
// 			case "number":
// 			case "range":
// 				value = +value || "";
// 				break;

// 			case "checkbox":
// 				value = target.checked;
// 				break;

// 			default:
// 				break;
// 		}

//         if (field === "inStock") {
//             value = value === "inStock" ? true : ""
//         }

//         setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
//     }

//     function handleMultiSelectChange(selectedOptions) {
//         const labels = selectedOptions.map((option) => option.value)
//         setFilterByToEdit((prevFilter) => ({ ...prevFilter, labels }))
//     }

//     const { name, labels = [], inStock } = filterByToEdit

//     return (
//         <section className="toy-filter">
//             <h2>Filter Toys</h2>
//             <form>
//                 <input
//                     value={name}
//                     onChange={handleChange}
//                     type="search"
//                     placeholder="By Name"
//                     id="name"
//                     name="name"
//                 />

//                 <label htmlFor="labels">Labels:</label>
//                 <MultiSelect
//                     options={labelOptions}
//                     value={labels.map((label) => ({ label, value: label }))}
//                     onChange={handleMultiSelectChange}
//                     labelledBy="Select Labels"
//                 />

//                 <label htmlFor="inStock">What Toys would you like to see:</label>
//                 <select
//                     name="inStock"
//                     id="inStock"
//                     onChange={handleChange}
//                     value={inStock === true ? "inStock" : ""}>
//                     <option value="">All</option>
//                     <option value="inStock">In stock</option>
//                 </select>
//             </form>
//         </section>
//     )
// }

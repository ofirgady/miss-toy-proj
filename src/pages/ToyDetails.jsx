import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { loadToy } from '../store/actions/toy.actions.js'

export function ToyDetails() {
	const toy = useSelector((storeState) => storeState.toyModule.toy)
	const isLoading = useSelector((storeState) => storeState.toyModule.isLoading)
	const params = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		onLoadToy()
	}, [params.toyId])

	async function onLoadToy() {
		try {
			if (params.toyId) {
				await loadToy(params.toyId)
				showSuccessMsg('Toy loaded successfully')
			}
		} catch (error) {
			showErrorMsg('Cannot load toy')
			navigate('/toy')
		}
	}

	function onBack() {
		navigate('/toy')
	}

	if (isLoading)
		return (
			<div className='loading-container'>
				<div className='loading'></div>
			</div>
		)

	return (
		<section className='toy-details'>
			<h1>{toy?.name}</h1>
			<h2>{toy?.inStock ? 'In Stock!' : 'Not in stock'}</h2>
			<h3>Price: ${toy?.price}</h3>
			<h4>Labels: {toy?.labels?.join(', ') || 'None'}</h4>
			<h4>Created At: {new Date(toy?.createdAt).toLocaleDateString()}</h4>
			{toy && <img src={toy.img} alt={toy.name} style={{ maxWidth: '150px' }} />}

			<p>{toy?.description || 'No description available for this toy.'}</p>

			<button onClick={onBack}>Back to toy list</button>
		</section>
	)
}

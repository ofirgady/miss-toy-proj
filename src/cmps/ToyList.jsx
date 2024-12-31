import { Link } from "react-router-dom"
import { ToyPreview } from "./ToyPreview"
import { useEffect } from "react"

export function ToyList({ toys, onRemoveToy }) {
	return (
		<ul className='toy-list'>
			{toys.map((toy) => (
				<li
					key={toy._id}
					style={{ backgroundColor: toy.color }}>
					<ToyPreview toy={toy} />
					<section>
						<button onClick={() => onRemoveToy(toy._id)}>Remove</button>
							<Link to={`/toy/${toy._id}`}> Details </Link>
							<Link to={`/toy/edit/${toy._id}`}>Edit</Link>
					</section>
				</li>
			))}
		</ul>
	)
}

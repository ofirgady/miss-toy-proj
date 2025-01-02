import { Link } from "react-router-dom";
import { ToyPreview } from "./ToyPreview";

export function ToyList({ toys, onRemoveToy }) {
	return (
		<ul className="toy-list clean-list">
			{toys.map((toy) => (
				<li key={toy._id} className="toy-card">
					<ToyPreview toy={toy} />
					<section className="actions">
						<button className="action-btn" onClick={() => onRemoveToy(toy._id)}>
							Remove
						</button>
						<Link className="action-btn" to={`/toy/${toy._id}`}>
							Details
						</Link>
						<Link className="action-btn" to={`/toy/edit/${toy._id}`}>
							Edit
						</Link>
					</section>
				</li>
			))}
		</ul>
	);
}
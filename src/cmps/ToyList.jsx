import { Link } from "react-router-dom";

export function ToyList({toys, onRemoveToy}) {
    return (
        <ul className="toy-list">
            {toys.map(toy =>
                <li key={toy._id} style={{ backgroundColor: toy.color }}>
                    <ToyPreview toy={toy} />
                    <section>
                        <button onClick={() => onRemoveToy(toy._id)}>Remove</button>
                        <button><Link to={`/toy/${toy._id}`}>Details</Link></button>
                        <button><Link to={`/toy/edit/${toy._id}`}>Edit</Link></button>
                    </section>
                </li>
            )}
        </ul>
    )
}

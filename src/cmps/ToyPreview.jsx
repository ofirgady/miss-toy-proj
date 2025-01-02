export function ToyPreview({ toy }) {
    return (
        <div className="toy-preview">
            <img src={toy.img || '/default-toy-image.png'} alt={toy.name} />
            <h3>{toy.name}</h3>
            <p>Price: ${toy.price}</p>
            <p>{toy.inStock ? 'In Stock' : 'Out of Stock'}</p>
        </div>
    );
}
export function ToyPreview({ toy }) {
	return (
		<article className='toy-preview'>
			<h2> Toy: {toy.name} </h2>
			<h4>Toy price: {toy.price}</h4>
			<img src={toy.img} alt={toy.name} />
		</article>
	)
}

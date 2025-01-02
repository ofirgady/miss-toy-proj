import React from 'react'
import { Link } from 'react-router-dom'

export function HomePage() {
	return (
		<section className='home-page'>
			<header className='hero'>
				<h1>Welcome to Miss Toy</h1>
				<p>Your ultimate destination for managing toys and inventory.</p>
				<Link to='/toy' className='cta-btn'>
					Explore Toys
				</Link>
			</header>

			<section className='features'>
				<h2>What We Offer</h2>
				<div className='feature-grid'>
					<div className='feature-card'>
						<h3>Organized Inventory</h3>
						<p>
							Easily manage and keep track of your toys with our simple and
							intuitive tools.
						</p>
					</div>
					<div className='feature-card'>
						<h3>Customizable Labels</h3>
						<p>
							Tag your toys with labels for easier categorization and sorting.
						</p>
					</div>
					<div className='feature-card'>
						<h3>Seamless Management</h3>
						<p>
							Upload images, edit toy details, and manage stock effortlessly.
						</p>
					</div>
				</div>
			</section>
		</section>
	)
}

import { useState } from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { ToyIndex } from './pages/ToyIndex.jsx'
import { ToyEdit } from './pages/ToyEdit.jsx'
import { ToyDetails } from './pages/ToyDetails.jsx'
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'

function App() {
	return (
			<Router>
				<section className='app'>
					<AppHeader />
					<main className='main-layout'>
						<Routes>
							<Route element={<HomePage />} path='/' />
							<Route element={<AboutUs />} path='/about' />
							<Route element={<ToyIndex />} path='/toy' />
							<Route element={<ToyDetails />} path='/toy/:toyId' />
							<Route element={<ToyEdit />} path='/toy/edit/:toyId?' />
						</Routes>
					</main>
					<AppFooter />
					<UserMsg />
				</section>
			</Router>
	)
}

export default App

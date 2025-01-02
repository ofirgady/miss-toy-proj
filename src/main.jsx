import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/style/scss/styles.scss'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { BrowserRouter } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter basename='/miss-toy-proj/'>
    <Provider store={store}>
        <App />
    </Provider>
    </BrowserRouter>
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/style/scss/styles.scss'
import App from './App.jsx'
import { Provider } from 'react-redux'


ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
)

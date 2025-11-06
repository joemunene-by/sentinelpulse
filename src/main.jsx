import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Analytics placeholder
window.__ANALYTICS_ENABLED = false

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// NEW: Import MUI ThemeProvider and your custome theme
import { ThemeProvider, CssBaseline } from '@mui/material'
import web3Theme from './Utils/theme'

const rootElement = document.getElementById('root')
if (!rootElement) {
    const errorDiv = document.createElement('div')
    errorDiv.innerHTML = `
        <h1>Missing Root Element</h1>
        <p>The root elemnent was not found. Please chech you index.html file.
    `
    document.body.appendChild(errorDiv)
    throw new Error('Root element not found')
}

const root = ReactDOM.createRoot(rootElement)
root.render(
    <React.StrictMode>
        <ThemeProvider theme={web3Theme}>
            <CssBaseline /> {/* Ensures consistent baseline styles for dark mode */}
            <App />
        </ThemeProvider>
    </React.StrictMode>
)
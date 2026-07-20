import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './components/ui/Toast.jsx'
import { ConfirmProvider } from './components/ui/Confirm.jsx'
import './index.css'

// A presentation-only mode for wireframes/mockups.  It intentionally lives
// outside React so it applies to every existing route without duplicating any
// screen or changing normal product behaviour.  Open any page with
// `?mockup=bw` to render the exact same UI in monochrome.
const query = new URLSearchParams(window.location.search)
if (query.get('mockup') === 'bw') {
  document.documentElement.classList.add('mockup-bw')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ConfirmProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ConfirmProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

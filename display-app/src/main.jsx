import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import AppKPP from './AppKPP.jsx'
import AppMobile from './AppMobile.jsx'
import AppWorkflow from './AppWorkflow.jsx'
import './index.css'

function App() {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth)
  
  // Check URL parameter for display mode
  const urlParams = new URLSearchParams(window.location.search)
  const displayMode = urlParams.get('mode') || 'workflow' // Default to workflow mode

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  // Use workflow mode by default (with voice from display)
  if (displayMode === 'workflow') {
    return <AppWorkflow />
  }
  
  // Legacy modes (voice from petugas/pk apps)
  return isPortrait ? <AppMobile /> : <AppKPP />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

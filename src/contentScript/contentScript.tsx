import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import Card from '@mui/material/Card'
import ReactDOM from 'react-dom'
import WeatherCard from '../components/WeatherCard'
import { getStoredOptions, LocalStorageOptions } from '../utils/storage'
import { Messages } from '../utils/messages'
import './contentScript.css'

const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null)
  const [isActive, setIsActive] = useState<boolean>(false)

  useEffect(() => {
    getStoredOptions().then((options) => {
      setOptions(options)
      setIsActive(options.hasAutoOverlay)
    })
  }, [])

  const handleMessages = (msg: Messages) => {
    if (msg === Messages.TOGGLE_OVERLAY) {
      setIsActive((prevIsActive) => !prevIsActive)
    }
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleMessages)
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessages)
    }
  }, [])

  if (!options) {
    return null
  }

  return (
    <>
      {isActive && (
        <Card className='overlayCard'>
          <WeatherCard
            city={options.homeCity}
            tempScale={options.tempScale}
            onDelete={() => setIsActive(false)}
          />
        </Card>
      )}
    </>
  )
}

// Create a new div element for the React app
// const rootElement = document.createElement('div')
// rootElement.id = 'root'
// document.body.appendChild(rootElement)

// const root = createRoot(rootElement)

// root.render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// )
const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
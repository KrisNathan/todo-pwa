import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './animations.css'
import App from './App.tsx'
import InstallContext from './components/InstallContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InstallContext>
      <App />
    </InstallContext>
  </StrictMode>,
)

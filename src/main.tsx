import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'nb-flexpay-ui/dist/style.css'
import './index.css'
import './enrollment/styles/adaptive-fields.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

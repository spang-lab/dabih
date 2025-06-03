import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { SessionWrapper } from './Session'

import App from './App'

const root = document.getElementById('root')!;

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <SessionWrapper>
        <App />
      </SessionWrapper>
    </BrowserRouter>
  </StrictMode>,
)

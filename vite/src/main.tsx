import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import routes from "virtual:generated-pages-react"
import { BrowserRouter, useRoutes } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {useRoutes(routes)}
    </Suspense>
  );
}


const root = document.getElementById('root')!;

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <App />
      <Footer />
    </BrowserRouter>
  </StrictMode>,
)

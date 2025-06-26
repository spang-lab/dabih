
import { Suspense } from 'react'
import './index.css'
import routes from "virtual:generated-pages-react"
import { useRoutes } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function App() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        {useRoutes(routes)}
      </Suspense>
      <Footer />
    </div>
  );
}

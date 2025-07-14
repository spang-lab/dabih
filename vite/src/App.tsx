
import { Suspense } from 'react'
import './index.css'
import routes from "virtual:generated-pages-react"
import { useRoutes } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Transfers from './pages/transfers/Transfers'


function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 flex grow">
      <div className="container mx-auto p-4  bg-white">
        {children}
      </div>
      <Transfers />
    </div>
  );
}





export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Container>
          {useRoutes(routes)}
        </Container>
      </Suspense>
      <Footer />
    </div>
  );
}

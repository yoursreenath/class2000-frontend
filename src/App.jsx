import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Members from './pages/Members'
import Teachers from './pages/Teachers'
import Gallery from './pages/Gallery'
import GivingBack from './pages/GivingBack'
import Events from './pages/Events'
import Discussion from './pages/Discussion'
import NewsPage from './pages/NewsPage'

function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="page-wrapper min-h-screen">
      <Navbar />
      {isHome ? (
        <div style={{margin:0, padding:0}}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      ) : (
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/members"     element={<Members />}    />
            <Route path="/teachers"    element={<Teachers />}   />
            <Route path="/gallery"     element={<Gallery />}    />
            <Route path="/giving-back" element={<GivingBack />} />
            <Route path="/events"      element={<Events />}     />
            <Route path="/discussions" element={<Discussion />} />
            <Route path="/news"        element={<NewsPage />}   />
          </Routes>
        </main>
      )}
      {!isHome && (
        <footer className="text-center py-8 text-sm" style={{ color: 'var(--ink-muted)', borderTop:'1px solid #f3f4f6' }}>
          <p style={{fontFamily:"'Libre Baskerville',serif",fontStyle:'italic'}}>ZP High School, KV Palli</p>
          <p className="mt-1">School Friends · Class of 2000 · 25 years of memories ✦</p>
        </footer>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  )
}

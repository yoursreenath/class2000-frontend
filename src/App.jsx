import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="page-wrapper min-h-screen">
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/"            element={<Home />}       />
              <Route path="/members"     element={<Members />}    />
              <Route path="/teachers"    element={<Teachers />}   />
              <Route path="/gallery"     element={<Gallery />}    />
              <Route path="/giving-back" element={<GivingBack />} />
              <Route path="/events"      element={<Events />}     />
              <Route path="/discussions" element={<Discussion />} />
              <Route path="/news"        element={<NewsPage />}   />
            </Routes>
          </main>
          <footer className="text-center py-8 text-sm" style={{ color: 'var(--ink-muted)' }}>
            <p style={{fontFamily:"'Libre Baskerville',serif",fontStyle:'italic'}}>Class of 2000</p>
            <p className="mt-1">25 years of memories, friendships & growing up ✦</p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

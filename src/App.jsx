import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Members from './pages/Members'
import Gallery from './pages/Gallery'
import Events from './pages/Events'
import Discussion from './pages/Discussion'
import NewsPage from './pages/NewsPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="page-wrapper min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<Members />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/events" element={<Events />} />
            <Route path="/discussions" element={<Discussion />} />
            <Route path="/news" element={<NewsPage />} />
          </Routes>
        </main>
        <footer className="text-center py-8 text-sm" style={{ color: 'var(--ink-muted)' }}>
          <p className="font-display italic text-base">Class of 2000</p>
          <p className="mt-1">25 years of memories, friendships & growing up ✦</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

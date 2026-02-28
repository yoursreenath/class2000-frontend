import { Link } from 'react-router-dom'
import { Users, Image, CalendarDays, MessageSquare, Newspaper, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { memberApi, eventApi, newsApi } from '../api'
import { format } from 'date-fns'

const features = [
  { to: '/members', icon: Users, label: 'Member Directory', desc: 'Find your old classmates and see what they\'re up to now.' },
  { to: '/gallery', icon: Image, label: 'Photo Gallery', desc: 'Relive the memories through our shared photo collection.' },
  { to: '/events', icon: CalendarDays, label: 'Events', desc: 'Stay updated on reunions, meetups, and celebrations.' },
  { to: '/discussions', icon: MessageSquare, label: 'Discussion Board', desc: 'Share stories, jokes, and connect with classmates.' },
  { to: '/news', icon: Newspaper, label: 'News & Updates', desc: 'Celebrate milestones, achievements, and class news.' },
]

export default function Home() {
  const [stats, setStats] = useState({ members: 0, events: 0, news: 0 })

  useEffect(() => {
    Promise.all([memberApi.getAll(), eventApi.getAll(), newsApi.getAll()])
      .then(([m, e, n]) => setStats({ members: m.data.length, events: e.data.length, news: n.data.length }))
      .catch(() => {})
  }, [])

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="text-center py-16 px-4">
        <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: 'var(--amber)' }}>
          ✦ 25 Years Later ✦
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-4" style={{ color: 'var(--ink)' }}>
          Welcome Back,<br />
          <span style={{ color: 'var(--amber)' }}>Class of 2000</span>
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: 'var(--ink-muted)' }}>
          A quarter century of memories, friendships, and journeys. This is your space to reconnect, reminisce, and celebrate.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link to="/members" className="btn-primary">Find Classmates</Link>
          <Link to="/events" className="btn-outline">View Events</Link>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-12">
          {[
            { label: 'Members', value: stats.members },
            { label: 'Upcoming Events', value: stats.events },
            { label: 'News Posts', value: stats.news },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-display text-3xl font-bold" style={{ color: 'var(--amber)' }}>{value}</p>
              <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px" style={{ background: '#e8d9b5' }} />
        <Heart size={16} style={{ color: 'var(--amber)' }} />
        <div className="flex-1 h-px" style={{ background: '#e8d9b5' }} />
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {features.map(({ to, icon: Icon, label, desc }) => (
          <Link to={to} key={to} className="card p-6 block no-underline">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: '#fef3c7' }}>
              <Icon size={20} style={{ color: 'var(--amber)' }} />
            </div>
            <h3 className="font-display text-lg font-bold mb-1" style={{ color: 'var(--ink)' }}>{label}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-muted)' }}>{desc}</p>
          </Link>
        ))}
      </div>

      {/* Quote */}
      <div className="text-center mt-16 mb-8 py-10 px-8 rounded-2xl" style={{ background: 'var(--sepia-light)' }}>
        <p className="font-display text-2xl italic" style={{ color: 'var(--ink)' }}>
          "The bond formed in school halls lasts a lifetime."
        </p>
        <p className="mt-3 text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>— Class of 2000, always</p>
      </div>
    </div>
  )
}

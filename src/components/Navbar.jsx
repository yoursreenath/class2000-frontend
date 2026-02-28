import { NavLink } from 'react-router-dom'
import { Users, Image, CalendarDays, MessageSquare, Newspaper, GraduationCap } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: GraduationCap },
  { to: '/members', label: 'Directory', icon: Users },
  { to: '/gallery', label: 'Gallery', icon: Image },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/discussions', label: 'Chat', icon: MessageSquare },
  { to: '/news', label: 'News', icon: Newspaper },
]

export default function Navbar() {
  return (
    <nav style={{ background: '#fffdf7', borderBottom: '1px solid #e8d9b5' }} className="sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--amber)' }}>
            <GraduationCap size={20} color="white" />
          </div>
          <div>
            <p className="font-display font-bold text-lg leading-tight" style={{ color: 'var(--ink)' }}>Class of 2000</p>
            <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>25th Reunion Portal</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white'
                    : 'hover:bg-amber-50'
                }`
              }
              style={({ isActive }) => isActive ? { background: 'var(--amber)', color: 'white' } : { color: 'var(--ink-muted)' }}
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-1">
          {navItems.slice(1).map(({ to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `p-2 rounded-lg transition-all ${isActive ? 'text-white' : ''}`
              }
              style={({ isActive }) => isActive ? { background: 'var(--amber)' } : { color: 'var(--ink-muted)' }}
            >
              <Icon size={18} />
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

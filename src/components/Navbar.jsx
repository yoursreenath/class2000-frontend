import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, LogIn, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AdminLogin from '../pages/AdminLogin'

const navItems = [
  { to: '/',            label: 'Home',        emoji: '🏠' },
  { to: '/members',     label: 'Classmates',  emoji: '👥' },
  { to: '/teachers',    label: 'Teachers',    emoji: '🎓' },
  { to: '/gallery',     label: 'Gallery',     emoji: '📸' },
  { to: '/giving-back', label: 'Giving Back', emoji: '🤝' },
  { to: '/events',      label: 'Events',      emoji: '📅' },
  { to: '/discussions', label: 'Chat',        emoji: '💬' },
  { to: '/news',        label: 'News',        emoji: '📰' },
]

export default function Navbar() {
  const { isAdmin, logout } = useAuth()
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLogin, setShowLogin]   = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <style>{`
        /* ── Top stripe — deep green ── */
        .nb-top {
          background: #14532d;
          padding: 6px 28px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nb-top-items { display: flex; gap: 24px; }
        .nb-top-item {
          font-size: 10.5px; font-weight: 500; letter-spacing: 0.08em;
          color: rgba(255,255,255,0.55); display: flex; align-items: center; gap: 6px;
        }
        .nb-top-item b { color: #86efac; font-weight: 600; }
        .nb-top-quote  { font-style: italic; font-size: 11px; color: rgba(255,255,255,0.30); }
        .nb-admin-badge {
          display: flex; align-items: center; gap: 6px;
          background: rgba(134,239,172,0.15); border: 1px solid rgba(134,239,172,0.30);
          border-radius: 999px; padding: 3px 12px;
          font-size: 10.5px; font-weight: 600; color: #86efac; letter-spacing: 0.08em;
        }

        /* ── Main nav — white ── */
        .nb-main {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 28px;
          display: flex; align-items: stretch;
          position: sticky; top: 0; z-index: 100;
          transition: box-shadow 0.3s;
        }
        .nb-main.scrolled { box-shadow: 0 2px 12px rgba(0,0,0,0.08); }

        /* ── Logo ── */
        .nb-logo {
          display: flex; align-items: center; gap: 13px;
          padding: 10px 20px 10px 0;
          border-right: 1px solid #e5e7eb; margin-right: 6px;
          text-decoration: none; flex-shrink: 0;
        }
        .nb-logo-seal {
          width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(145deg, #14532d, #16a34a, #22c55e);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 2px 10px rgba(22,163,74,0.35);
        }
        .nb-logo-name { font-family: 'Libre Baskerville', serif; font-size: 15px; font-weight: 700; color: #111827; line-height: 1.15; }
        .nb-logo-tag  { font-size: 9px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: #6b7280; margin-top: 3px; }

        /* ── Nav links ── */
        .nb-links { display: flex; align-items: stretch; flex: 1; }
        .nb-link {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 2px; padding: 10px 13px; text-decoration: none; color: #6b7280;
          font-size: 10.5px; font-weight: 500; letter-spacing: 0.04em;
          border-bottom: 3px solid transparent;
          transition: color 0.18s, border-color 0.18s, background 0.18s;
          white-space: nowrap;
        }
        .nb-link:hover  { color: #15803d; background: #f0fdf4; }
        .nb-link.active { color: #15803d; border-bottom-color: #16a34a; background: #f0fdf4; font-weight: 600; }
        .nb-link .nl-emoji { font-size: 15px; line-height: 1; transition: transform 0.18s; }
        .nb-link:hover .nl-emoji, .nb-link.active .nl-emoji { transform: scale(1.22); }

        /* ── Right section ── */
        .nb-right {
          display: flex; align-items: center; gap: 10px;
          padding-left: 16px; border-left: 1px solid #e5e7eb;
          margin-left: auto; flex-shrink: 0;
        }
        .nb-year-pill {
          background: #14532d; color: #86efac;
          font-family: 'Libre Baskerville', serif; font-size: 12px; font-weight: 700;
          letter-spacing: 0.10em; padding: 5px 14px; border-radius: 4px;
        }
        .nb-login-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 6px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
          background: #16a34a; color: white; transition: all 0.18s;
        }
        .nb-login-btn:hover { background: #14532d; }
        .nb-logout-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 6px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
          background: #ffffff; color: #15803d; border: 1.5px solid #16a34a; transition: all 0.18s;
        }
        .nb-logout-btn:hover { background: #f0fdf4; }
        .nb-admin-pill {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 999px;
          background: #dcfce7; color: #15803d;
          font-size: 11px; font-weight: 600; letter-spacing: 0.05em;
        }

        /* ── Mobile ── */
        .nb-ham { display: none; background: none; border: none; cursor: pointer; padding: 8px; color: #6b7280; }
        .nb-drawer-overlay { display: none; position: fixed; inset: 0; z-index: 200; }
        .nb-drawer-overlay.open { display: block; }
        .nb-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.40); backdrop-filter: blur(4px); }
        .nb-panel {
          position: absolute; top: 0; right: 0; bottom: 0; width: 270px;
          background: #ffffff; display: flex; flex-direction: column;
          box-shadow: -4px 0 24px rgba(0,0,0,0.12);
          animation: slideFromRight 0.28s ease both;
        }
        @keyframes slideFromRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .nb-panel-head {
          background: #14532d; padding: 22px 20px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nb-panel-title { font-family: 'Libre Baskerville', serif; font-size: 17px; font-weight: 700; color: white; }
        .nb-panel-sub   { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-top: 2px; }
        .nb-close { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.20); border-radius: 6px; padding: 6px; cursor: pointer; color: white; display: flex; }
        .nb-panel-items { padding: 8px 0; flex: 1; overflow-y: auto; }
        .nb-dlink {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 22px; text-decoration: none; color: #4b5563;
          font-size: 14px; font-weight: 500;
          border-left: 3px solid transparent; transition: all 0.15s;
        }
        .nb-dlink:hover  { background: #f0fdf4; color: #15803d; border-left-color: #bbf7d0; }
        .nb-dlink.active { background: #f0fdf4; color: #15803d; border-left-color: #16a34a; font-weight: 600; }
        .nb-dlink .nl-emoji { font-size: 20px; width: 26px; text-align: center; }
        .nb-panel-foot {
          padding: 14px 22px; border-top: 1px solid #f3f4f6;
          font-family: 'Libre Baskerville', serif; font-style: italic;
          font-size: 12.5px; color: #9ca3af; text-align: center;
        }
        .nb-panel-admin { padding: 14px 22px; border-top: 1px solid #f3f4f6; display: flex; flex-direction: column; gap: 8px; }

        @media (max-width: 780px) {
          .nb-links, .nb-right,
          .nb-top-items .nb-top-item:nth-child(n+3), .nb-top-quote { display: none !important; }
          .nb-ham { display: flex !important; align-items: center; }
        }
      `}</style>

      {/* Top stripe */}
      <div className="nb-top">
        <div className="nb-top-items">
          <div className="nb-top-item">🏫 <b>ZP High School, KV Palli</b></div>
          <div className="nb-top-item">📅 <b>25 Years</b> of Memories</div>
          <div className="nb-top-item">🎓 <b>10th Grade Batch</b> · 1999 – 2000</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {isAdmin && <div className="nb-admin-badge"><ShieldCheck size={11}/> Admin Mode</div>}
          <div className="nb-top-quote">"Once a classmate, always a friend." ✦</div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`nb-main${scrolled?' scrolled':''}`}>
        <NavLink to="/" className="nb-logo">
          <div className="nb-logo-seal">🎓</div>
          <div>
            <div className="nb-logo-name">ZP High School, KV Palli</div>
            <div className="nb-logo-tag">School Friends · Class of 2000</div>
          </div>
        </NavLink>

        <div className="nb-links">
          {navItems.map(({ to, label, emoji }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => `nb-link${isActive?' active':''}`}>
              <span className="nl-emoji">{emoji}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="nb-right">
          <div className="nb-year-pill">✦ 2000 ✦</div>
          {isAdmin ? (
            <>
              <div className="nb-admin-pill"><ShieldCheck size={12}/> Admin</div>
              <button className="nb-logout-btn" onClick={logout}><LogOut size={13}/> Logout</button>
            </>
          ) : (
            <button className="nb-login-btn" onClick={() => setShowLogin(true)}>
              <LogIn size={13}/> Admin
            </button>
          )}
        </div>

        <button className="nb-ham" onClick={() => setMobileOpen(true)}><Menu size={22}/></button>
      </nav>

      {/* Mobile drawer */}
      <div className={`nb-drawer-overlay${mobileOpen?' open':''}`}>
        <div className="nb-backdrop" onClick={() => setMobileOpen(false)}/>
        <div className="nb-panel">
          <div className="nb-panel-head">
            <div>
              <div className="nb-panel-title">🎓 ZP High School, KV Palli</div>
              <div className="nb-panel-sub">School Friends · Class of 2000</div>
            </div>
            <button className="nb-close" onClick={() => setMobileOpen(false)}><X size={17}/></button>
          </div>
          <div className="nb-panel-items">
            {navItems.map(({ to, label, emoji }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) => `nb-dlink${isActive?' active':''}`}
                onClick={() => setMobileOpen(false)}>
                <span className="nl-emoji">{emoji}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
          <div className="nb-panel-admin">
            {isAdmin ? (
              <>
                <div className="nb-admin-pill" style={{justifyContent:'center'}}><ShieldCheck size={13}/> Logged in as Admin</div>
                <button className="nb-logout-btn" style={{justifyContent:'center'}} onClick={() => { logout(); setMobileOpen(false) }}>
                  <LogOut size={13}/> Logout
                </button>
              </>
            ) : (
              <button className="nb-login-btn" style={{justifyContent:'center'}} onClick={() => { setShowLogin(true); setMobileOpen(false) }}>
                <LogIn size={13}/> Admin Login
              </button>
            )}
          </div>
          <div className="nb-panel-foot">"Once a classmate, always a friend." ✦</div>
        </div>
      </div>

      {showLogin && <AdminLogin onClose={() => setShowLogin(false)}/>}
    </>
  )
}

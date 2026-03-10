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
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [showLogin, setShowLogin]     = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <style>{`
        .nb-top {
          background: var(--board);
          padding: 5px 28px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 2px solid rgba(240,192,96,0.20);
        }
        .nb-top-items { display: flex; gap: 24px; }
        .nb-top-item {
          font-size: 10.5px; font-weight: 500; letter-spacing: 0.09em;
          color: rgba(255,255,255,0.45); display: flex; align-items: center; gap: 6px;
        }
        .nb-top-item b { color: rgba(240,192,96,0.80); font-weight: 600; }
        .nb-top-quote {
          font-family: 'Libre Baskerville', serif; font-style: italic;
          font-size: 11px; color: rgba(255,255,255,0.28);
        }

        /* Admin badge in top bar */
        .nb-admin-badge {
          display: flex; align-items: center; gap: 6px;
          background: rgba(240,192,96,0.15); border: 1px solid rgba(240,192,96,0.30);
          border-radius: 999px; padding: 3px 12px;
          font-size: 10.5px; font-weight: 600; color: rgba(240,192,96,0.90);
          letter-spacing: 0.08em;
        }

        .nb-main {
          background: #fffcf4;
          border-bottom: 1px solid #e2cfa0;
          padding: 0 28px;
          display: flex; align-items: stretch;
          position: sticky; top: 0; z-index: 100;
          transition: box-shadow 0.3s;
        }
        .nb-main.scrolled { box-shadow: 0 4px 24px rgba(100,60,10,0.13); }
        .nb-main::after {
          content: '';
          position: absolute; bottom: -3px; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent 0%, var(--amber) 20%, var(--amber-light) 50%, var(--amber) 80%, transparent 100%);
          opacity: 0.45;
        }

        .nb-logo {
          display: flex; align-items: center; gap: 13px;
          padding: 12px 22px 12px 0;
          border-right: 1px solid #e2cfa0; margin-right: 6px;
          text-decoration: none; flex-shrink: 0;
        }
        .nb-logo-seal {
          width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(145deg, #7c3d0a, #b45309, #d97706);
          display: flex; align-items: center; justify-content: center; font-size: 22px;
          box-shadow: 0 3px 12px rgba(124,61,10,0.40), inset 0 1px 0 rgba(255,255,255,0.18);
          position: relative;
        }
        .nb-logo-seal::after {
          content: ''; position: absolute; inset: -3px; border-radius: 50%;
          border: 1.5px solid rgba(212,168,83,0.45);
        }
        .nb-logo-name { font-family: 'Libre Baskerville', serif; font-size: 18px; font-weight: 700; color: var(--ink); line-height: 1.1; }
        .nb-logo-tag  { font-size: 9.5px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: var(--sepia); margin-top: 2px; }

        .nb-links { display: flex; align-items: stretch; flex: 1; }
        .nb-link {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 2px; padding: 10px 13px; text-decoration: none; color: var(--ink-muted);
          font-size: 10.5px; font-weight: 500; letter-spacing: 0.04em;
          border-bottom: 3px solid transparent;
          transition: color 0.18s, background 0.18s, border-color 0.18s;
          white-space: nowrap; position: relative;
        }
        .nb-link:hover { color: var(--amber-dark); background: rgba(253,243,220,0.55); }
        .nb-link.active { color: var(--amber-dark); border-bottom-color: var(--amber); background: rgba(253,243,220,0.40); }
        .nb-link .nl-emoji { font-size: 15px; line-height: 1; transition: transform 0.18s; }
        .nb-link:hover .nl-emoji, .nb-link.active .nl-emoji { transform: scale(1.22); }
        .nb-link.active::before {
          content: ''; position: absolute; top: 7px; right: 9px;
          width: 4px; height: 4px; border-radius: 50%; background: var(--amber);
        }

        /* Right section */
        .nb-right {
          display: flex; align-items: center; gap: 10px;
          padding-left: 16px; border-left: 1px solid #e2cfa0;
          margin-left: auto; flex-shrink: 0;
        }
        .nb-year-pill {
          background: var(--ink); color: var(--amber-light);
          font-family: 'Libre Baskerville', serif; font-size: 13px; font-weight: 700;
          letter-spacing: 0.12em; padding: 6px 16px; border-radius: 3px;
          border: 1px solid rgba(212,168,83,0.28);
        }

        /* Admin / Login button */
        .nb-login-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 4px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
          letter-spacing: 0.04em; transition: all 0.18s;
          background: var(--ink); color: var(--amber-light);
          border: 1px solid rgba(212,168,83,0.28);
        }
        .nb-login-btn:hover { background: #2c1a08; box-shadow: 0 3px 12px rgba(0,0,0,0.20); }
        .nb-logout-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 4px; border: 1.5px solid #e2cfa0; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
          background: #fef3c7; color: var(--amber-dark); transition: all 0.18s;
        }
        .nb-logout-btn:hover { background: var(--parch); border-color: var(--amber); }

        /* Admin indicator pill */
        .nb-admin-pill {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 999px;
          background: linear-gradient(135deg, #065f46, #059669);
          color: white; font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
          box-shadow: 0 2px 8px rgba(5,150,105,0.35);
        }

        /* Mobile */
        .nb-ham { display: none; background: none; border: none; cursor: pointer; padding: 8px; color: var(--ink-muted); }
        .nb-drawer-overlay { display: none; position: fixed; inset: 0; z-index: 200; }
        .nb-drawer-overlay.open { display: block; }
        .nb-backdrop { position: absolute; inset: 0; background: rgba(15,8,0,0.60); backdrop-filter: blur(4px); }
        .nb-panel {
          position: absolute; top: 0; right: 0; bottom: 0; width: 270px;
          background: #fffcf4; display: flex; flex-direction: column;
          box-shadow: -8px 0 40px rgba(0,0,0,0.22);
          animation: slideFromRight 0.28s ease both;
        }
        @keyframes slideFromRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .nb-panel-head {
          background: var(--board); padding: 22px 20px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nb-panel-title { font-family: 'Libre Baskerville', serif; font-size: 18px; font-weight: 700; color: white; }
        .nb-panel-sub   { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.38); margin-top: 2px; }
        .nb-close { background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 6px; cursor: pointer; color: white; display: flex; }
        .nb-panel-items { padding: 10px 0; flex: 1; overflow-y: auto; }
        .nb-dlink {
          display: flex; align-items: center; gap: 14px;
          padding: 13px 22px; text-decoration: none; color: var(--ink-muted);
          font-size: 14px; font-weight: 500;
          border-left: 3px solid transparent; transition: all 0.15s;
        }
        .nb-dlink:hover  { background: rgba(253,243,220,0.80); color: var(--amber-dark); border-left-color: rgba(201,124,16,0.35); }
        .nb-dlink.active { background: #fef3c7; color: var(--amber-dark); border-left-color: var(--amber); }
        .nb-dlink .nl-emoji { font-size: 20px; width: 26px; text-align: center; }
        .nb-panel-foot {
          padding: 14px 22px; border-top: 1px solid #e2cfa0;
          font-family: 'Libre Baskerville', serif; font-style: italic;
          font-size: 12.5px; color: var(--sepia); text-align: center;
        }
        .nb-panel-admin {
          padding: 14px 22px; border-top: 1px solid #e2cfa0;
          display: flex; flex-direction: column; gap: 8px;
        }

        @media (max-width: 780px) {
          .nb-links, .nb-right,
          .nb-top-items .nb-top-item:nth-child(n+3), .nb-top-quote { display: none !important; }
          .nb-ham { display: flex !important; align-items: center; }
        }
      `}</style>

      {/* Top stripe */}
      <div className="nb-top">
        <div className="nb-top-items">
          <div className="nb-top-item">🏫 <b>10th Grade Batch</b> · 1999 – 2000</div>
          <div className="nb-top-item">📅 <b>25 Years</b> of Memories</div>
          <div className="nb-top-item">🎓 <b>Class of 2000</b> Portal</div>
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
            <div className="nb-logo-name">Class of 2000</div>
            <div className="nb-logo-tag">10th Grade · Batch Portal</div>
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
              <button className="nb-logout-btn" onClick={logout}>
                <LogOut size={13}/> Logout
              </button>
            </>
          ) : (
            <button className="nb-login-btn" onClick={() => setShowLogin(true)}>
              <LogIn size={13}/> Admin
            </button>
          )}
        </div>

        <button className="nb-ham" onClick={() => setMobileOpen(true)}>
          <Menu size={22}/>
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`nb-drawer-overlay${mobileOpen?' open':''}`}>
        <div className="nb-backdrop" onClick={() => setMobileOpen(false)}/>
        <div className="nb-panel">
          <div className="nb-panel-head">
            <div>
              <div className="nb-panel-title">🎓 Class of 2000</div>
              <div className="nb-panel-sub">10th Batch Portal</div>
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

      {/* Admin login modal */}
      {showLogin && <AdminLogin onClose={() => setShowLogin(false)}/>}
    </>
  )
}

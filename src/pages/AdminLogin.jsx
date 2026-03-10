import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Lock, User } from 'lucide-react'

export default function AdminLogin({ onClose }) {
  const { login, error, setError } = useAuth()
  const [form, setForm]     = useState({ user: '', pass: '' })
  const [showPass, setShowPass] = useState(false)
  const [shaking, setShaking]   = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    const ok = login(form.user, form.pass)
    if (!ok) {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    } else {
      onClose?.()
    }
  }

  return (
    <>
      <style>{`
        .al-overlay {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(15,8,0,0.65); backdrop-filter: blur(5px);
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease both;
        }
        .al-box {
          background: #fffcf4;
          border: 1px solid #e2cfa0;
          border-radius: 6px;
          padding: 40px 36px 32px;
          width: 100%; max-width: 380px;
          box-shadow: 0 24px 64px rgba(44,26,8,0.35);
          position: relative;
          animation: popIn 0.3s ease both;
        }
        .al-box.shake {
          animation: shake 0.45s ease both;
        }
        @keyframes shake {
          0%,100%{ transform: translateX(0); }
          20%    { transform: translateX(-8px); }
          40%    { transform: translateX(8px); }
          60%    { transform: translateX(-5px); }
          80%    { transform: translateX(5px); }
        }
        .al-seal {
          width: 56px; height: 56px; border-radius: 50%; margin: 0 auto 18px;
          background: linear-gradient(135deg, #7c3d0a, #b45309, #d97706);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          box-shadow: 0 4px 18px rgba(124,61,10,0.40);
        }
        .al-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 1.3rem; font-weight: 700; color: var(--ink);
          text-align: center; margin-bottom: 4px;
        }
        .al-sub {
          font-size: 12px; color: var(--ink-muted); text-align: center;
          font-style: italic; margin-bottom: 26px;
        }
        .al-field {
          position: relative; margin-bottom: 16px;
        }
        .al-field-icon {
          position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
          color: var(--ink-muted); pointer-events: none;
        }
        .al-input {
          width: 100%; padding: 11px 14px 11px 38px;
          border: 1.5px solid #d4b87a; border-radius: 4px;
          background: #fdf8f0; color: var(--ink);
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .al-input:focus {
          border-color: var(--amber);
          box-shadow: 0 0 0 3px rgba(201,124,16,0.12);
        }
        .al-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: var(--ink-muted);
          padding: 2px; display: flex;
        }
        .al-error {
          background: #fef2f2; border: 1px solid #fca5a5; border-radius: 4px;
          color: #b91c1c; font-size: 12.5px; padding: 9px 13px; margin-bottom: 16px;
          display: flex; align-items: center; gap: 7px;
        }
        .al-submit {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #7c3d0a, #b45309, #d97706);
          color: white; border: none; border-radius: 4px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; letter-spacing: 0.04em;
          box-shadow: 0 4px 18px rgba(124,61,10,0.38);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .al-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(124,61,10,0.48); }
        .al-close {
          position: absolute; top: 14px; right: 14px;
          background: none; border: none; cursor: pointer;
          color: var(--ink-muted); font-size: 18px; line-height: 1;
          padding: 4px 7px; border-radius: 3px; transition: background 0.15s;
        }
        .al-close:hover { background: var(--parch); }
        .al-hint {
          text-align: center; font-size: 11px; color: var(--ink-muted);
          margin-top: 14px; font-style: italic;
        }
      `}</style>

      <div className="al-overlay" onClick={e => { if(e.target===e.currentTarget){ onClose?.(); setError('') } }}>
        <div className={`al-box${shaking?' shake':''}`}>
          {onClose && <button className="al-close" onClick={() => { onClose(); setError('') }}>✕</button>}

          <div className="al-seal">🔐</div>
          <div className="al-title">Admin Login</div>
          <div className="al-sub">Class of 2000 · Batch Portal</div>

          {error && (
            <div className="al-error">
              <Lock size={13}/> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="al-field">
              <User size={15} className="al-field-icon"/>
              <input
                className="al-input"
                placeholder="Username"
                autoComplete="username"
                value={form.user}
                onChange={e => setForm({...form, user: e.target.value})}
              />
            </div>

            <div className="al-field" style={{marginBottom: 20}}>
              <Lock size={15} className="al-field-icon"/>
              <input
                className="al-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="current-password"
                style={{paddingRight: 38}}
                value={form.pass}
                onChange={e => setForm({...form, pass: e.target.value})}
              />
              <button type="button" className="al-eye" onClick={() => setShowPass(v=>!v)}>
                {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>

            <button type="submit" className="al-submit">
              🔓 Login as Admin
            </button>
          </form>

          <p className="al-hint">Only the batch admin can add, edit or delete content.</p>
        </div>
      </div>
    </>
  )
}

import { useEffect, useState } from 'react'
import { Plus, X, Pencil, Trash2 } from 'lucide-react'
import { newsApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'

const CATEGORIES = ['ANNOUNCEMENT','MILESTONE','MEMORY','TRIBUTE','OTHER']
const CAT_STYLE = {
  ANNOUNCEMENT: { bg:'#fef3c7', color:'#92400e', border:'#f0c060', icon:'📢' },
  MILESTONE:    { bg:'#dcfce7', color:'#166534', border:'#86efac', icon:'🏆' },
  MEMORY:       { bg:'#eff6ff', color:'#1e40af', border:'#93c5fd', icon:'📖' },
  TRIBUTE:      { bg:'#fdf2f8', color:'#86198f', border:'#f0abfc', icon:'🕯️' },
  OTHER:        { bg:'#f3f4f6', color:'#374151', border:'#d1d5db', icon:'📌' },
}
const EMPTY = { title:'', content:'', author:'', category:'ANNOUNCEMENT' }

export default function NewsPage() {
  const { isAdmin } = useAuth()
  const [news, setNews]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [filter, setFilter]     = useState('ALL')
  const [form, setForm]         = useState(EMPTY)

  const load = async () => {
    setLoading(true)
    try { const r = await newsApi.getAll(); setNews(r.data) } catch { setNews([]) }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = n => { setEditing(n); setForm({ title:n.title||'', content:n.content||'', author:n.author||'', category:n.category||'ANNOUNCEMENT' }); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY) }

  const handleSubmit = async e => {
    e.preventDefault()
    if (editing) await newsApi.update(editing.id, form)
    else await newsApi.create(form)
    closeForm(); load()
  }
  const handleDelete = async id => {
    if (!window.confirm('Delete this post?')) return
    try { await newsApi.delete(id); load() } catch {}
  }

  const filtered = filter==='ALL' ? news : news.filter(n=>n.category===filter)

  const formFields = [
    { label:'Headline *',   key:'title',   full:true, required:true, placeholder:'e.g. Priya Nair wins National Award!' },
    { label:'Posted By',    key:'author',  placeholder:'Your name' },
    { label:'Content *',    key:'content', full:true, required:true, area:true, placeholder:'Share the full story…' },
  ]

  return (
    <div className="fade-in">
      <style>{`
        .news-card { background:#ffffff;border:1px solid rgba(148,197,255,0.20);border-radius:4px;padding:22px;box-shadow:0 2px 12px rgba(0,0,0,0.12);transition:transform 0.22s,box-shadow 0.22s;position:relative;overflow:hidden; }
        .news-card:hover { transform:translateY(-2px);box-shadow:0 8px 24px rgba(100,60,10,0.14); }
        .news-cat-stripe { position:absolute;top:0;left:0;bottom:0;width:4px; }
        .news-headline { font-family:'Libre Baskerville',serif;font-size:17px;font-weight:700;color:#0f172a;margin:0 0 10px;line-height:1.35; }
        .news-body   { font-size:13.5px;line-height:1.82;color:#0f172a; }
        .news-footer { display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:14px;padding-top:12px;border-top:1px solid var(--parch);font-size:11.5px;color:#475569; }
        .filter-bar  { display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px; }
        .filter-chip { font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:5px 14px;border-radius:3px;border:1.5px solid #93c5fd;background:#ffffff;color:#475569;cursor:pointer;transition:all 0.18s; }
        .filter-chip:hover  { border-color:#3b82f6;color:#1d4ed8; }
        .filter-chip.active { background:var(--ink);color:var(--amber-light);border-color:#0f172a; }
        .card-actions { display:flex;gap:6px; }
        .btn-edit { display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:3px;border:1.5px solid #93c5fd;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s; }
        .btn-edit:hover { background:#eff6ff; }
        .btn-del  { display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:3px;border:1.5px solid #fca5a5;background:#fef2f2;color:#b91c1c;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s; }
        .btn-del:hover { background:#fee2e2; }
        .news-form { background:#ffffff;border:1px solid rgba(148,197,255,0.20);border-radius:4px;padding:22px;margin-bottom:22px;box-shadow:0 4px 16px rgba(0,0,0,0.14);animation:slideDown 0.3s ease both; }
        .form-grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px; }
        @media(max-width:600px){ .form-grid-2{grid-template-columns:1fr;} }
        .form-label { font-size:11px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--sepia);display:block;margin-bottom:5px; }
      `}</style>

      <div className="page-header">
        <div>
          <h1 className="page-title">📰 Batch Bulletin</h1>
          <p className="page-subtitle">Announcements, milestones and memories — Class of 2000</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={showForm ? closeForm : openAdd}>
            {showForm ? <><X size={14}/> Cancel</> : <><Plus size={14}/> Post News</>}
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="filter-bar">
        {['ALL',...CATEGORIES].map(c=>(
          <button key={c} className={`filter-chip${filter===c?' active':''}`} onClick={()=>setFilter(c)}>
            {CAT_STYLE[c]?.icon||'🗂'} {c}
          </button>
        ))}
      </div>

      {/* Add / Edit form */}
      {isAdmin && showForm && (
        <div className="news-form">
          <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',marginBottom:4}}>
            ✦ {editing ? 'Edit Post' : 'Post to the Bulletin'}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              {formFields.map(({label,key,placeholder,required,full,area})=>(
                <div key={key} style={full?{gridColumn:'1/-1'}:{}}>
                  <label className="form-label">{label}</label>
                  {area
                    ? <textarea required={required} className="input-field" style={{height:96}} placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>
                    : <input    required={required} className="input-field" placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>
                  }
                </div>
              ))}
              <div>
                <label className="form-label">Category</label>
                <select className="input-field" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:'flex',gap:10,marginTop:14}}>
              <button type="submit" className="btn-primary">{editing ? '✓ Save Changes' : '📌 Publish'}</button>
              <button type="button" className="btn-outline" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading
        ? <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading…</p></div>
        : filtered.length===0
          ? <div className="empty-state"><div className="empty-icon">📰</div><p>Nothing here yet.</p><small>Be the first to share some batch news!</small></div>
          : <div style={{display:'flex',flexDirection:'column',gap:16}} className="stagger">
              {filtered.map(n=>{
                const cs = CAT_STYLE[n.category]||CAT_STYLE.OTHER
                return (
                  <div key={n.id} className="news-card">
                    <div className="news-cat-stripe" style={{background:cs.color+'99'}}/>
                    <div style={{paddingLeft:14}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                        <span style={{fontSize:16}}>{cs.icon}</span>
                        <span style={{fontSize:10.5,fontWeight:600,letterSpacing:'0.10em',textTransform:'uppercase',background:cs.bg,color:cs.color,padding:'2px 9px',borderRadius:2,border:`1px solid ${cs.border}`}}>{n.category}</span>
                      </div>
                      <h3 className="news-headline">{n.title}</h3>
                      <p className="news-body">{n.content}</p>
                      <div className="news-footer">
                        {n.author      && <span>✍️ {n.author}</span>}
                        {n.publishedAt && <span>📅 {format(new Date(n.publishedAt),'d MMM yyyy')}</span>}
                        {isAdmin && (
                          <div className="card-actions" style={{marginLeft:'auto'}}>
                            <button className="btn-edit" onClick={()=>openEdit(n)}><Pencil size={11}/> Edit</button>
                            <button className="btn-del"  onClick={()=>handleDelete(n.id)}><Trash2 size={11}/> Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
      }
    </div>
  )
}

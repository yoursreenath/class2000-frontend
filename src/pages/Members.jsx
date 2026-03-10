import { useEffect, useState, useRef } from 'react'
import { Search, MapPin, Briefcase, Plus, X, Upload, User, Loader2, Pencil, Trash2 } from 'lucide-react'
import { memberApi, uploadPhoto } from '../api'
import { useAuth } from '../context/AuthContext'

const EMPTY_FORM = { firstName:'', currentCity:'', currentJob:'', bio:'' }

export default function Members() {
  const { isAdmin } = useAuth()
  const [members, setMembers]   = useState([])
  const [query, setQuery]       = useState('')
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY_FORM)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl]     = useState(null)
  const [uploading, setUploading]       = useState(false)
  const [uploadError, setUploadError]   = useState('')
  const fileInputRef = useRef(null)

  const load = async () => {
    setLoading(true)
    try { const r = query ? await memberApi.search(query) : await memberApi.getAll(); setMembers(r.data) }
    catch { setMembers([]) }
    setLoading(false)
  }
  useEffect(() => { load() }, [query])

  const handleFileChange = e => {
    const f = e.target.files[0]; if (!f) return
    if (!f.type.startsWith('image/')) { setUploadError('Please select an image.'); return }
    if (f.size > 10*1024*1024) { setUploadError('Max 10MB allowed.'); return }
    setUploadError(''); setSelectedFile(f); setPreviewUrl(URL.createObjectURL(f))
  }

  const openAdd = () => {
    setEditing(null); setForm(EMPTY_FORM)
    setSelectedFile(null); setPreviewUrl(null); setUploadError(''); setShowForm(true)
  }
  const openEdit = m => {
    setEditing(m)
    setForm({ firstName: m.firstName||'', currentCity: m.currentCity||'', currentJob: m.currentJob||'', bio: m.bio||'' })
    setSelectedFile(null); setPreviewUrl(m.photoUrl||null); setUploadError(''); setShowForm(true)
  }
  const resetForm = () => {
    setShowForm(false); setEditing(null); setForm(EMPTY_FORM)
    setSelectedFile(null); setPreviewUrl(null); setUploadError('')
  }

  const handleSubmit = async e => {
    e.preventDefault(); setUploading(true)
    try {
      let photoUrl = editing?.photoUrl || ''
      if (selectedFile) photoUrl = await uploadPhoto(selectedFile)
      if (editing) await memberApi.update(editing.id, { ...form, photoUrl })
      else         await memberApi.create({ ...form, lastName: '', photoUrl })
      resetForm(); load()
    } catch { setUploadError('Failed to save. Please try again.') }
    finally   { setUploading(false) }
  }

  const handleDelete = async m => {
    if (!window.confirm(`Remove ${m.firstName} from the register?`)) return
    try { await memberApi.delete(m.id); load() } catch {}
  }

  return (
    <div className="fade-in">
      <style>{`
        .reg-card { background:#fffcf4; border:1px solid #e2cfa0; border-radius:4px; padding:20px; position:relative; transition:transform 0.22s,box-shadow 0.22s; box-shadow:0 2px 10px rgba(100,60,10,0.08); overflow:hidden; }
        .reg-card::after { content:''; position:absolute; top:0;left:0;right:0;height:3px; background:linear-gradient(90deg,var(--amber),var(--amber-light),transparent); opacity:0; transition:opacity 0.22s; }
        .reg-card:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(100,60,10,0.15); }
        .reg-card:hover::after { opacity:1; }
        .reg-avatar { width:90px;height:90px;border-radius:50%;flex-shrink:0;overflow:hidden; background:linear-gradient(135deg,var(--amber-dark),var(--amber)); display:flex;align-items:center;justify-content:center; box-shadow:0 3px 14px rgba(124,61,10,0.32); border:3px solid #fffcf4; outline:2px solid rgba(212,168,83,0.45); }
        .reg-avatar img { width:100%;height:100%;object-fit:cover; }
        .reg-avatar-text { font-family:'Libre Baskerville',serif;font-size:28px;font-weight:700;color:white; }
        .reg-name { font-family:'Libre Baskerville',serif;font-size:16px;font-weight:700;color:var(--ink); }
        .reg-meta { display:flex;flex-wrap:wrap;gap:10px;margin-top:6px; }
        .reg-meta-item { display:flex;align-items:center;gap:4px;font-size:12px;color:var(--ink-muted); }
        .reg-bio { font-size:13px;line-height:1.75;color:var(--ink);font-style:italic; padding-left:12px;border-left:2px solid var(--parch);margin:10px 0; }
        .card-actions { display:flex;gap:6px;margin-top:12px;padding-top:10px;border-top:1px solid var(--parch); }
        .btn-edit { display:flex;align-items:center;gap:5px;padding:5px 12px;border-radius:3px;border:1.5px solid #d4b87a;background:#fef9f0;color:var(--amber-dark);font-size:11.5px;font-weight:600;cursor:pointer;transition:all 0.15s; }
        .btn-edit:hover { background:var(--parch);border-color:var(--amber); }
        .btn-del  { display:flex;align-items:center;gap:5px;padding:5px 12px;border-radius:3px;border:1.5px solid #fca5a5;background:#fef2f2;color:#b91c1c;font-size:11.5px;font-weight:600;cursor:pointer;transition:all 0.15s; }
        .btn-del:hover { background:#fee2e2; }
        .add-form-wrap { background:#fffcf4;border:1px solid #e2cfa0;border-radius:4px;padding:24px;margin-bottom:24px;box-shadow:0 2px 14px rgba(100,60,10,0.08);animation:slideDown 0.3s ease both; }
        .form-grid { display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px; }
        @media(max-width:600px){ .form-grid{grid-template-columns:1fr;} }
        .form-label { font-size:11px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--sepia);display:block;margin-bottom:5px; }
        .photo-drop { border:2px dashed #d4b87a;border-radius:4px;padding:18px;text-align:center;cursor:pointer;transition:border-color 0.2s,background 0.2s;background:#fdf8f0; }
        .photo-drop:hover,.photo-drop.has { border-color:var(--amber);background:#fffbef; }
      `}</style>

      <div className="page-header">
        <div>
          <h1 className="page-title">📋 Classmates Register</h1>
          <p className="page-subtitle">{loading ? 'Loading…' : `${members.length} student${members.length!==1?'s':''} registered · 10th Grade Batch 2000`}</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={showForm ? resetForm : openAdd}>
            {showForm ? <><X size={14}/> Cancel</> : <><Plus size={14}/> Add Classmate</>}
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <div className="add-form-wrap">
          <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:'1.15rem',fontWeight:700,color:'var(--ink)',marginBottom:16}}>
            ✦ {editing ? `Edit — ${editing.firstName}` : 'Add to the Register'}
          </div>
          <div className={`photo-drop${previewUrl?' has':''}`}
            onClick={()=>fileInputRef.current?.click()}
            onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();handleFileChange({target:{files:e.dataTransfer.files}})}}>
            {previewUrl
              ? <img src={previewUrl} alt="preview" style={{height:90,borderRadius:4,objectFit:'cover',marginBottom:4}}/>
              : <div style={{fontSize:32,marginBottom:6}}>📷</div>
            }
            <p style={{fontSize:12,color:'var(--ink-muted)',margin:0}}>{previewUrl?'Click to change photo':'Click or drop photo (optional)'}</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFileChange}/>
          {uploadError && <p style={{color:'#b91c1c',fontSize:12,marginTop:6}}>{uploadError}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div style={{gridColumn:'1/-1'}}>
                <label className="form-label">Full Name *</label>
                <input required className="input-field" placeholder="e.g. Ravi Kumar" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})}/>
              </div>
              <div>
                <label className="form-label">Current City</label>
                <input className="input-field" placeholder="Where are you now?" value={form.currentCity} onChange={e=>setForm({...form,currentCity:e.target.value})}/>
              </div>
              <div>
                <label className="form-label">Profession</label>
                <input className="input-field" placeholder="What do you do?" value={form.currentJob} onChange={e=>setForm({...form,currentJob:e.target.value})}/>
              </div>
              <div style={{gridColumn:'1/-1'}}>
                <label className="form-label">About yourself</label>
                <textarea className="input-field" style={{height:80}} placeholder="Where life has taken you since 2000…" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/>
              </div>
            </div>
            <div style={{display:'flex',gap:10,marginTop:16}}>
              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? <><Loader2 size={14} style={{animation:'spin 1s linear infinite'}}/> Saving…</> : editing ? '✓ Save Changes' : '✓ Add to Register'}
              </button>
              <button type="button" className="btn-outline" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="search-wrap">
        <Search size={15} className="search-icon"/>
        <input className="input-field" placeholder="Search classmate by name…" value={query} onChange={e=>setQuery(e.target.value)}/>
      </div>

      {loading
        ? <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading the register…</p></div>
        : members.length===0
          ? <div className="empty-state"><div className="empty-icon">📋</div><p>No classmates found.</p></div>
          : <div className="stagger" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
              {members.map(m=>(
                <div key={m.id} className="reg-card">
                  <div style={{display:'flex',alignItems:'flex-start',gap:16,marginBottom:10}}>
                    <div className="reg-avatar">
                      {m.photoUrl ? <img src={m.photoUrl} alt="" onError={e=>e.target.style.display='none'}/> : <span className="reg-avatar-text">{m.firstName?.[0]}</span>}
                    </div>
                    <div style={{flex:1}}>
                      <div className="reg-name">{m.firstName}</div>
                      <div className="reg-meta">
                        {m.currentCity && <span className="reg-meta-item"><MapPin size={11}/>{m.currentCity}</span>}
                        {m.currentJob  && <span className="reg-meta-item"><Briefcase size={11}/>{m.currentJob}</span>}
                      </div>
                    </div>
                  </div>
                  {m.bio && <p className="reg-bio">"{m.bio}"</p>}
                  {isAdmin && (
                    <div className="card-actions">
                      <button className="btn-edit" onClick={()=>openEdit(m)}><Pencil size={12}/> Edit</button>
                      <button className="btn-del"  onClick={()=>handleDelete(m)}><Trash2 size={12}/> Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
      }
    </div>
  )
}

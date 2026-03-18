import { useEffect, useState, useRef } from 'react'
import { Search, BookOpen, Plus, X, Upload, User, Loader2, Award, Pencil, Trash2 } from 'lucide-react'
import { teacherApi, uploadPhoto } from '../api'
import { useAuth } from '../context/AuthContext'

const EMPTY = { firstName:'', subject:'', designation:'', currentStatus:'Retired', bio:'' }
const STATUS_STYLE = {
  'Retired':        { bg:'#fef3c7', color:'#92400e', icon:'🎖️' },
  'Still Teaching': { bg:'#dcfce7', color:'#166534', icon:'📚' },
  'Passed Away':    { bg:'#f3f4f6', color:'#4b5563', icon:'🕯️' },
}

export default function Teachers() {
  const { isAdmin } = useAuth()
  const [teachers, setTeachers] = useState([])
  const [query, setQuery]       = useState('')
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl]     = useState(null)
  const [uploading, setUploading]       = useState(false)
  const [uploadError, setUploadError]   = useState('')
  const fileInputRef = useRef(null)

  const load = async () => {
    setLoading(true)
    try { const r = query ? await teacherApi.search(query) : await teacherApi.getAll(); setTeachers(r.data) }
    catch { setTeachers([]) }
    setLoading(false)
  }
  useEffect(() => { load() }, [query])

  const handleFileChange = e => {
    const f = e.target.files[0]; if (!f) return
    if (!f.type.startsWith('image/')) { setUploadError('Please select an image.'); return }
    setUploadError(''); setSelectedFile(f); setPreviewUrl(URL.createObjectURL(f))
  }

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setSelectedFile(null); setPreviewUrl(null); setUploadError(''); setShowForm(true) }
  const openEdit = t => {
    setEditing(t)
    setForm({ firstName: t.firstName||'', subject: t.subject||'', designation: t.designation||'', currentStatus: t.currentStatus||'Retired', bio: t.bio||'' })
    setSelectedFile(null); setPreviewUrl(t.photoUrl||null); setUploadError(''); setShowForm(true)
  }
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY); setSelectedFile(null); setPreviewUrl(null); setUploadError('') }

  const handleSubmit = async e => {
    e.preventDefault(); setUploading(true)
    try {
      let photoUrl = editing?.photoUrl || ''
      if (selectedFile) photoUrl = await uploadPhoto(selectedFile)
      if (editing) await teacherApi.update(editing.id, { ...form, lastName: '', photoUrl })
      else         await teacherApi.create({ ...form, lastName: '', photoUrl })
      closeForm(); load()
    } catch { setUploadError('Failed to save. Please try again.') }
    finally   { setUploading(false) }
  }

  const handleDelete = async t => {
    if (!window.confirm(`Remove ${t.firstName} from the Hall of Honour?`)) return
    try { await teacherApi.delete(t.id); load() } catch {}
  }

  return (
    <div className="fade-in">
      <style>{`
        .tc-card { background:#ffffff; border:1px solid rgba(148,197,255,0.20); border-radius:4px; padding:20px; position:relative; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,0.12); transition:transform 0.22s,box-shadow 0.22s; }
        .tc-card:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,0,0,0.22); }
        .tc-card::before { content:''; position:absolute; top:0;left:0;right:0;height:3px; background:linear-gradient(90deg,var(--green-chalk),#52b788,transparent); opacity:0; transition:opacity 0.22s; }
        .tc-card:hover::before { opacity:1; }
        .tc-avatar { width:90px;height:90px;border-radius:50%;flex-shrink:0;overflow:hidden; background:linear-gradient(135deg,var(--green-chalk),#52b788); display:flex;align-items:center;justify-content:center; font-family:'Libre Baskerville',serif;font-size:28px;font-weight:700;color:white; box-shadow:0 3px 14px rgba(45,106,79,0.32); border:3px solid #ffffff;outline:2px solid rgba(82,183,136,0.40); }
        .tc-name    { font-family:'Libre Baskerville',serif;font-size:17px;font-weight:700;color:#0f172a; }
        .tc-subject { font-size:13px;font-weight:600;color:var(--green-chalk);display:flex;align-items:center;gap:5px;margin-top:4px; }
        .tc-meta    { display:flex;flex-wrap:wrap;gap:10px;margin:8px 0; }
        .tc-meta-item { display:flex;align-items:center;gap:4px;font-size:11.5px;color:#475569; }
        .tc-bio  { font-size:13px;line-height:1.78;color:#0f172a;font-style:italic; padding-left:12px;border-left:2px solid #d8f3dc;margin:10px 0; }
        .card-actions { display:flex;gap:6px;margin-top:12px;padding-top:10px;border-top:1px solid var(--parch); }
        .btn-edit { display:flex;align-items:center;gap:5px;padding:5px 12px;border-radius:3px;border:1.5px solid #93c5fd;background:#eff6ff;color:#1d4ed8;font-size:11.5px;font-weight:600;cursor:pointer;transition:all 0.15s; }
        .btn-edit:hover { background:#eff6ff;border-color:#3b82f6; }
        .btn-del  { display:flex;align-items:center;gap:5px;padding:5px 12px;border-radius:3px;border:1.5px solid #fca5a5;background:#fef2f2;color:#b91c1c;font-size:11.5px;font-weight:600;cursor:pointer;transition:all 0.15s; }
        .btn-del:hover { background:#fee2e2; }
        .add-form-wrap { background:#ffffff;border:1px solid rgba(148,197,255,0.20);border-radius:4px;padding:24px;margin-bottom:24px;box-shadow:0 4px 16px rgba(0,0,0,0.14);animation:slideDown 0.3s ease both; }
        .form-grid { display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px; }
        @media(max-width:600px){ .form-grid{grid-template-columns:1fr;} }
        .form-label { font-size:11px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--sepia);display:block;margin-bottom:5px; }
        .photo-drop { border:2px dashed #93c5fd;border-radius:4px;padding:18px;text-align:center;cursor:pointer;transition:border-color 0.2s,background 0.2s;background:#f8fafc; }
        .photo-drop:hover,.photo-drop.has { border-color:#3b82f6;background:#fffbef; }
      `}</style>

      <div className="page-header">
        <div>
          <h1 className="page-title">🎓 Hall of Honour</h1>
          <p className="page-subtitle">The teachers who shaped us — remembered forever</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={showForm ? closeForm : openAdd}>
            {showForm ? <><X size={14}/> Cancel</> : <><Plus size={14}/> Add Teacher</>}
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <div className="add-form-wrap">
          <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:'1.15rem',fontWeight:700,color:'var(--ink)',marginBottom:16}}>
            ✦ {editing ? `Edit — ${editing.firstName}` : 'Add to Hall of Honour'}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:16}}>
            <div className={`photo-drop${previewUrl?' has':''}`}
              style={{width:80,height:80,padding:0,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',flexShrink:0,overflow:'hidden'}}
              onClick={()=>fileInputRef.current?.click()}>
              {previewUrl ? <img src={previewUrl} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <User size={28} style={{color:'#d4b87a'}}/>}
            </div>
            <div>
              <button type="button" className="btn-outline" style={{fontSize:12,padding:'7px 14px'}} onClick={()=>fileInputRef.current?.click()}>
                <Upload size={12}/> {previewUrl?'Change Photo':'Upload Photo'}
              </button>
              <p style={{fontSize:11,color:'var(--ink-muted)',marginTop:5}}>Optional · JPG, PNG · max 10MB</p>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFileChange}/>
          {uploadError && <p style={{color:'#b91c1c',fontSize:12,marginBottom:10}}>{uploadError}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div style={{gridColumn:'1/-1'}}>
                <label className="form-label">Full Name *</label>
                <input required className="input-field" placeholder="e.g. Rajesh Krishnamurthy" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})}/>
              </div>
              <div>
                <label className="form-label">Subject *</label>
                <input required className="input-field" placeholder="e.g. Chemistry" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/>
              </div>
              <div>
                <label className="form-label">Designation</label>
                <input className="input-field" placeholder="e.g. Class Teacher" value={form.designation} onChange={e=>setForm({...form,designation:e.target.value})}/>
              </div>
              <div>
                <label className="form-label">Status</label>
                <select className="input-field" value={form.currentStatus} onChange={e=>setForm({...form,currentStatus:e.target.value})}>
                  <option>Retired</option><option>Still Teaching</option><option>Passed Away</option>
                </select>
              </div>
              <div style={{gridColumn:'1/-1'}}>
                <label className="form-label">A note about this teacher</label>
                <textarea className="input-field" style={{height:80}} placeholder="What made them special to your batch?" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}/>
              </div>
            </div>
            <div style={{display:'flex',gap:10,marginTop:16}}>
              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? <><Loader2 size={14} style={{animation:'spin 1s linear infinite'}}/> Saving…</> : editing ? '✓ Save Changes' : '✓ Add to Honour Roll'}
              </button>
              <button type="button" className="btn-outline" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="search-wrap">
        <Search size={15} className="search-icon"/>
        <input className="input-field" placeholder="Search teacher by name…" value={query} onChange={e=>setQuery(e.target.value)}/>
      </div>

      {loading
        ? <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading…</p></div>
        : teachers.length===0
          ? <div className="empty-state"><div className="empty-icon">🎓</div><p>No teachers added yet.</p><small>Add a teacher who made a difference.</small></div>
          : <div className="stagger" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:16}}>
              {teachers.map(t=>{
                const ss = STATUS_STYLE[t.currentStatus]||STATUS_STYLE['Retired']
                return (
                  <div key={t.id} className="tc-card">
                    <div style={{display:'flex',alignItems:'flex-start',gap:14,marginBottom:8}}>
                      <div className="tc-avatar">
                        {t.photoUrl ? <img src={t.photoUrl} alt="" onError={e=>e.target.style.display='none'}/> : <span>{t.firstName?.[0]}</span>}
                      </div>
                      <div style={{flex:1}}>
                        <div className="tc-name">{t.firstName}</div>
                        {t.subject && <div className="tc-subject"><BookOpen size={12}/>{t.subject}</div>}
                        <span style={{fontSize:10.5,fontWeight:600,background:ss.bg,color:ss.color,padding:'2px 9px',borderRadius:2,border:`1px solid ${ss.color}40`,display:'inline-block',marginTop:5}}>{ss.icon} {t.currentStatus}</span>
                      </div>
                    </div>
                    <div className="tc-meta">
                      {t.designation && <span className="tc-meta-item"><Award size={11}/>{t.designation}</span>}
                    </div>
                    {t.bio && <p className="tc-bio">"{t.bio}"</p>}
                    {isAdmin && (
                      <div className="card-actions">
                        <button className="btn-edit" onClick={()=>openEdit(t)}><Pencil size={12}/> Edit</button>
                        <button className="btn-del"  onClick={()=>handleDelete(t)}><Trash2 size={12}/> Delete</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
      }
    </div>
  )
}

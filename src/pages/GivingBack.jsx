import { useEffect, useState, useRef } from 'react'
import { Heart, Car, GraduationCap, HandHeart, Plus, X, Loader2, Upload, Pencil, Trash2 } from 'lucide-react'
import { initiativeApi, uploadPhoto } from '../api'
import { useAuth } from '../context/AuthContext'

const typeConfig = {
  infrastructure: { gradient:'linear-gradient(135deg,#78350f,#92400e,#b45309)', icon:Car,        label:'Infrastructure' },
  support:        { gradient:'linear-gradient(135deg,#1c1008,#3d2004,#6b3a0a)', icon:GraduationCap, label:'Support' },
  donation:       { gradient:'linear-gradient(135deg,#14532d,#166534,#15803d)', icon:HandHeart,   label:'Donation' },
  event:          { gradient:'linear-gradient(135deg,#1e1b4b,#312e81,#4338ca)', icon:Heart,       label:'Event' },
}
const EMPTY = { title:'', description:'', type:'infrastructure', badge:'', year: new Date().getFullYear().toString() }

export default function GivingBack() {
  const { isAdmin } = useAuth()
  const [items, setItems]       = useState([])
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
    try { const r = await initiativeApi.getAll(); setItems(r.data) }
    catch { setItems([]) }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleFileChange = e => {
    const f = e.target.files[0]; if (!f) return
    if (!f.type.startsWith('image/')) { setUploadError('Please select an image.'); return }
    setUploadError(''); setSelectedFile(f); setPreviewUrl(URL.createObjectURL(f))
  }

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setSelectedFile(null); setPreviewUrl(null); setUploadError(''); setShowForm(true) }
  const openEdit = item => {
    setEditing(item)
    setForm({ title:item.title||'', description:item.description||'', type:item.type||'infrastructure', badge:item.badge||'', year:item.year||'' })
    setSelectedFile(null); setPreviewUrl(item.imageUrl||null); setUploadError(''); setShowForm(true)
  }
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY); setSelectedFile(null); setPreviewUrl(null); setUploadError('') }

  const handleSubmit = async e => {
    e.preventDefault(); setUploading(true)
    try {
      let imageUrl = editing?.imageUrl || ''
      if (selectedFile) imageUrl = await uploadPhoto(selectedFile)
      if (editing) await initiativeApi.update(editing.id, { ...form, imageUrl })
      else         await initiativeApi.create({ ...form, imageUrl })
      closeForm(); load()
    } catch { setUploadError('Failed to save. Please try again.') }
    finally   { setUploading(false) }
  }

  const handleDelete = async id => {
    if (!window.confirm('Remove this initiative?')) return
    try { await initiativeApi.delete(id); load() } catch {}
  }

  return (
    <div className="fade-in">
      <style>{`
        .gb-card {
          border-radius:6px; overflow:hidden; position:relative;
          box-shadow:0 4px 20px rgba(0,0,0,0.22);
          transition:transform 0.25s, box-shadow 0.25s;
        }
        .gb-card:hover { transform:translateY(-4px); box-shadow:0 12px 36px rgba(0,0,0,0.30); }
        .gb-card-inner { padding:28px 24px; color:white; min-height:260px; display:flex; flex-direction:column; justify-content:space-between; }
        .gb-img { width:100%; height:180px; object-fit:cover; display:block; }
        .gb-type-badge { display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:999px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);font-size:10.5px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;margin-bottom:12px; }
        .gb-card-title { font-family:'Libre Baskerville',serif;font-size:18px;font-weight:700;line-height:1.35;margin-bottom:10px; }
        .gb-card-desc  { font-size:13px;line-height:1.78;opacity:0.82;flex:1; }
        .gb-badge-strip { margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.18);font-size:11px;font-weight:600;letter-spacing:0.08em;opacity:0.75;display:flex;align-items:center;gap:6px; }
        .gb-year { position:absolute;top:14px;right:14px;background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.20);border-radius:2px;padding:3px 10px;font-size:11px;font-weight:700;color:white;letter-spacing:0.08em; }
        .gb-card-actions { display:flex;gap:6px;margin-top:12px; }
        .btn-gb-edit { display:flex;align-items:center;gap:4px;padding:5px 12px;border-radius:3px;border:1.5px solid rgba(255,255,255,0.35);background:rgba(255,255,255,0.12);color:white;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s; }
        .btn-gb-edit:hover { background:rgba(255,255,255,0.22); }
        .btn-gb-del  { display:flex;align-items:center;gap:4px;padding:5px 12px;border-radius:3px;border:1.5px solid rgba(239,68,68,0.50);background:rgba(239,68,68,0.18);color:#fca5a5;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s; }
        .btn-gb-del:hover { background:rgba(239,68,68,0.30); }
        .gb-form { background:#fffcf4;border:1px solid #e2cfa0;border-radius:4px;padding:24px;margin-bottom:24px;box-shadow:0 2px 14px rgba(100,60,10,0.08);animation:slideDown 0.3s ease both; }
        .form-grid { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
        @media(max-width:600px){ .form-grid{grid-template-columns:1fr;} }
        .form-label { font-size:11px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--sepia);display:block;margin-bottom:5px; }
        .photo-drop { border:2px dashed #d4b87a;border-radius:4px;padding:18px;text-align:center;cursor:pointer;transition:border-color 0.2s,background 0.2s;background:#fdf8f0; }
        .photo-drop:hover,.photo-drop.has { border-color:var(--amber);background:#fffbef; }
      `}</style>

      <div className="page-header">
        <div>
          <h1 className="page-title">🤝 Giving Back</h1>
          <p className="page-subtitle">How our batch continues to give back to school and society</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={showForm ? closeForm : openAdd}>
            {showForm ? <><X size={14}/> Cancel</> : <><Plus size={14}/> Add Initiative</>}
          </button>
        )}
      </div>

      {/* Add / Edit form */}
      {isAdmin && showForm && (
        <div className="gb-form">
          <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:'1.15rem',fontWeight:700,color:'var(--ink)',marginBottom:16}}>
            ✦ {editing ? 'Edit Initiative' : 'Add a New Initiative'}
          </div>

          {/* Photo upload */}
          <div className={`photo-drop${previewUrl?' has':''}`}
            onClick={()=>fileInputRef.current?.click()}
            onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();handleFileChange({target:{files:e.dataTransfer.files}})}}>
            {previewUrl
              ? <img src={previewUrl} alt="preview" style={{maxHeight:160,borderRadius:4,objectFit:'cover',marginBottom:6}}/>
              : <><div style={{fontSize:36,marginBottom:8}}>🖼️</div><p style={{fontSize:12,color:'var(--ink-muted)',margin:0}}>Click or drop a photo (optional)</p></>
            }
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFileChange}/>
          {uploadError && <p style={{color:'#b91c1c',fontSize:12,marginTop:8}}>{uploadError}</p>}

          <form onSubmit={handleSubmit} style={{marginTop:16}}>
            <div className="form-grid">
              <div style={{gridColumn:'1/-1'}}>
                <label className="form-label">Title *</label>
                <input required className="input-field" placeholder="e.g. New Vehicle Stand for Our School" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
              </div>
              <div>
                <label className="form-label">Type</label>
                <select className="input-field" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                  {Object.entries(typeConfig).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Year</label>
                <input className="input-field" placeholder="e.g. 2024" value={form.year} onChange={e=>setForm({...form,year:e.target.value})}/>
              </div>
              <div style={{gridColumn:'1/-1'}}>
                <label className="form-label">Badge Text</label>
                <input className="input-field" placeholder="e.g. Built with love by Class of 2000" value={form.badge} onChange={e=>setForm({...form,badge:e.target.value})}/>
              </div>
              <div style={{gridColumn:'1/-1'}}>
                <label className="form-label">Description *</label>
                <textarea required className="input-field" style={{height:96}} placeholder="Tell the story behind this initiative…" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
              </div>
            </div>
            <div style={{display:'flex',gap:10,marginTop:16}}>
              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? <><Loader2 size={14} style={{animation:'spin 1s linear infinite'}}/> Saving…</> : editing ? '✓ Save Changes' : '✓ Add Initiative'}
              </button>
              <button type="button" className="btn-outline" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading
        ? <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading initiatives…</p></div>
        : items.length===0
          ? <div className="empty-state"><div className="empty-icon">🤝</div><p>No initiatives yet.</p>{isAdmin&&<small>Add the first giving-back story!</small>}</div>
          : <div className="stagger" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:20}}>
              {items.map(item=>{
                const cfg = typeConfig[item.type]||typeConfig.infrastructure
                const Icon = cfg.icon
                return (
                  <div key={item.id} className="gb-card">
                    {item.imageUrl && <img className="gb-img" src={item.imageUrl} alt={item.title} onError={e=>e.target.style.display='none'}/>}
                    <div className="gb-card-inner" style={{background:cfg.gradient}}>
                      {item.year && <div className="gb-year">{item.year}</div>}
                      <div>
                        <div className="gb-type-badge"><Icon size={12}/>{cfg.label}</div>
                        <h3 className="gb-card-title">{item.title}</h3>
                        <p className="gb-card-desc">{item.description}</p>
                      </div>
                      {item.badge && (
                        <div className="gb-badge-strip">✦ {item.badge}</div>
                      )}
                      {isAdmin && (
                        <div className="gb-card-actions">
                          <button className="btn-gb-edit" onClick={()=>openEdit(item)}><Pencil size={11}/> Edit</button>
                          <button className="btn-gb-del"  onClick={()=>handleDelete(item.id)}><Trash2 size={11}/> Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
      }
    </div>
  )
}

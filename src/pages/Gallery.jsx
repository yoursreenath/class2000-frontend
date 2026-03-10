import { useEffect, useState, useRef } from 'react'
import { Plus, X, User, Upload, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react'
import { photoApi, uploadPhoto } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Gallery() {
  const { isAdmin } = useAuth()
  const [photos, setPhotos]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm]         = useState({ title:'', description:'', uploadedBy:'', tags:'' })
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl]     = useState(null)
  const [uploading, setUploading]       = useState(false)
  const [uploadError, setUploadError]   = useState('')
  const fileInputRef = useRef(null)

  const load = async () => {
    setLoading(true)
    try { const r = await photoApi.getAll(); setPhotos(r.data) }
    catch { setPhotos([]) }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleFileChange = e => {
    const f = e.target.files[0]; if (!f) return
    if (!f.type.startsWith('image/')) { setUploadError('Please select an image file.'); return }
    if (f.size > 10*1024*1024)        { setUploadError('Max size is 10MB.'); return }
    setUploadError(''); setSelectedFile(f); setPreviewUrl(URL.createObjectURL(f))
  }
  const resetForm = () => {
    setShowForm(false); setForm({ title:'', description:'', uploadedBy:'', tags:'' })
    setSelectedFile(null); setPreviewUrl(null); setUploadError('')
  }
  const handleSubmit = async e => {
    e.preventDefault()
    if (!selectedFile) { setUploadError('Please select a photo.'); return }
    setUploading(true)
    try {
      const imageUrl = await uploadPhoto(selectedFile)
      await photoApi.create({ ...form, imageUrl })
      resetForm(); load()
    } catch { setUploadError('Upload failed. Please try again.') }
    finally   { setUploading(false) }
  }
  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this photo?')) return
    try { await photoApi.delete(id); load() } catch {}
  }

  return (
    <div className="fade-in">
      <style>{`
        .gallery-grid { columns:1; gap:14px; }
        @media(min-width:500px){ .gallery-grid { columns:2; } }
        @media(min-width:900px){ .gallery-grid { columns:3; } }
        .gallery-item { break-inside:avoid; margin-bottom:14px; border-radius:4px; overflow:hidden;
          border:1px solid #e2cfa0; cursor:pointer; position:relative;
          box-shadow:0 2px 10px rgba(100,60,10,0.08); transition:transform 0.22s,box-shadow 0.22s; }
        .gallery-item:hover { transform:translateY(-3px); box-shadow:0 10px 24px rgba(100,60,10,0.18); }
        .gallery-item img { width:100%; display:block; object-fit:cover; background:#f5e6c8; }
        .gallery-caption { padding:12px 14px; background:#fffcf4; }
        .gallery-caption h3 { font-family:'Libre Baskerville',serif;font-size:13.5px;font-weight:700;color:var(--ink);margin:0 0 4px; }
        .gallery-tag { font-size:10px;font-weight:600;padding:2px 8px;border-radius:2px;background:#fef3c7;color:var(--amber-dark); }
        /* admin delete overlay */
        .gallery-del-btn {
          position:absolute; top:8px; right:8px; z-index:10;
          background:rgba(185,28,28,0.88); border:none; border-radius:4px;
          padding:6px 10px; color:white; font-size:11px; font-weight:600;
          cursor:pointer; display:flex; align-items:center; gap:4px;
          opacity:0; transition:opacity 0.18s;
        }
        .gallery-item:hover .gallery-del-btn { opacity:1; }
        /* upload form */
        .gal-form-wrap { background:#fffcf4;border:1px solid #e2cfa0;border-radius:4px;padding:24px;margin-bottom:24px;box-shadow:0 2px 14px rgba(100,60,10,0.08);animation:slideDown 0.3s ease both; }
        .drop-zone { border:2px dashed #d4b87a;border-radius:4px;padding:28px 20px;text-align:center;cursor:pointer;transition:border-color 0.2s,background 0.2s;background:#fdf8f0; }
        .drop-zone:hover,.drop-zone.has { border-color:var(--amber);background:#fffbef; }
        .form-label { font-size:11px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--sepia);display:block;margin-bottom:5px; }
        /* lightbox */
        .lightbox-overlay { position:fixed;inset:0;z-index:500;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease both; }
        .lightbox-inner { position:relative;max-width:820px;width:100%; }
        .lightbox-inner img { width:100%;border-radius:6px;object-fit:contain;max-height:72vh; }
        .lightbox-info { margin-top:14px;color:white; }
        .lightbox-close { position:absolute;top:-38px;right:0;background:rgba(255,255,255,0.12);border:none;border-radius:6px;padding:6px 12px;color:white;cursor:pointer;font-size:18px;line-height:1; }
      `}</style>

      <div className="page-header">
        <div>
          <h1 className="page-title">📸 Photo Gallery</h1>
          <p className="page-subtitle">Memories captured in time — Class of 2000</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={showForm ? resetForm : ()=>setShowForm(true)}>
            {showForm ? <><X size={14}/> Cancel</> : <><Plus size={14}/> Upload Photo</>}
          </button>
        )}
      </div>

      {/* Upload form — admin only */}
      {isAdmin && showForm && (
        <div className="gal-form-wrap">
          <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:'1.15rem',fontWeight:700,color:'var(--ink)',marginBottom:16}}>✦ Upload a Memory</div>
          <form onSubmit={handleSubmit}>
            <div className={`drop-zone${previewUrl?' has':''}`}
              onClick={()=>fileInputRef.current?.click()}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{e.preventDefault();handleFileChange({target:{files:e.dataTransfer.files}})}}>
              {previewUrl
                ? <><img src={previewUrl} style={{maxHeight:200,borderRadius:4,objectFit:'contain',marginBottom:8}}/><p style={{fontSize:12,color:'var(--ink-muted)'}}>Click to replace</p></>
                : <><div style={{fontSize:40,marginBottom:10}}>🖼️</div><p style={{fontFamily:"'Libre Baskerville',serif",fontWeight:600,color:'var(--ink)',marginBottom:4}}>Click or drag & drop a photo</p><p style={{fontSize:12,color:'var(--ink-muted)'}}>JPG · PNG · GIF · max 10MB</p></>
              }
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFileChange}/>
            {uploadError && <p style={{color:'#b91c1c',fontSize:12,marginTop:8}}>{uploadError}</p>}

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:16}}>
              {[
                {label:'Photo Title *', key:'title', full:true, required:true, placeholder:'e.g. Sports Day 1999'},
                {label:'Your Name',     key:'uploadedBy', placeholder:'Who shared this?'},
                {label:'Tags',          key:'tags', placeholder:'e.g. sports, class-photo'},
                {label:'Description',   key:'description', full:true, area:true, placeholder:'Tell the story behind this photo…'},
              ].map(({label,key,placeholder,required,full,area})=>(
                <div key={key} style={full?{gridColumn:'1/-1'}:{}}>
                  <label className="form-label">{label}</label>
                  {area
                    ? <textarea className="input-field" style={{height:68}} placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>
                    : <input required={required} className="input-field" placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>
                  }
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:10,marginTop:16}}>
              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? <><Loader2 size={14} style={{animation:'spin 1s linear infinite'}}/> Uploading…</> : <><Upload size={14}/> Upload Photo</>}
              </button>
              <button type="button" className="btn-outline" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading
        ? <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading gallery…</p></div>
        : photos.length === 0
          ? <div className="empty-state"><div className="empty-icon">📷</div><p>No photos yet.</p>{isAdmin && <small>Upload the first memory!</small>}</div>
          : <div className="gallery-grid stagger">
              {photos.map(photo => (
                <div key={photo.id} className="gallery-item" onClick={()=>setSelected(photo)}>
                  {isAdmin && (
                    <button className="gallery-del-btn" onClick={e=>handleDelete(photo.id,e)}>
                      <Trash2 size={11}/> Delete
                    </button>
                  )}
                  <img src={photo.imageUrl} alt={photo.title} style={{maxHeight:280}} onError={e=>e.target.style.display='none'}/>
                  <div className="gallery-caption">
                    <h3>{photo.title}</h3>
                    {photo.tags && (
                      <div style={{display:'flex',flexWrap:'wrap',gap:4,marginTop:5}}>
                        {photo.tags.split(',').map(t=>t.trim()).filter(Boolean).map(tag=>(
                          <span key={tag} className="gallery-tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                    {photo.uploadedBy && <p style={{fontSize:11,color:'var(--ink-muted)',marginTop:5,display:'flex',alignItems:'center',gap:4}}><User size={10}/>{photo.uploadedBy}</p>}
                  </div>
                </div>
              ))}
            </div>
      }

      {/* Lightbox */}
      {selected && (
        <div className="lightbox-overlay" onClick={()=>setSelected(null)}>
          <div className="lightbox-inner" onClick={e=>e.stopPropagation()}>
            <button className="lightbox-close" onClick={()=>setSelected(null)}>✕</button>
            <img src={selected.imageUrl} alt={selected.title}/>
            <div className="lightbox-info">
              <h3 style={{fontFamily:"'Libre Baskerville',serif",fontSize:18,fontWeight:700,margin:'0 0 6px'}}>{selected.title}</h3>
              {selected.description && <p style={{fontSize:13,opacity:0.75,margin:0}}>{selected.description}</p>}
              {selected.uploadedBy  && <p style={{fontSize:12,opacity:0.55,marginTop:6,display:'flex',alignItems:'center',gap:4}}><User size={12}/>{selected.uploadedBy}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

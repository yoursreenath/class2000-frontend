import { useEffect, useState, useRef } from 'react'
import { Plus, X, User, Upload, Image as ImageIcon, Loader2, Trash2, Pencil, ChevronRight, ArrowLeft, MapPin, Calendar } from 'lucide-react'
import { photoApi, uploadPhoto, getTogetherApi, getTogetherPhotosApi } from '../api'
import { useAuth } from '../context/AuthContext'

// ─────────────────────────────────────────────
// ALBUM VIEW — photos for one get-together
// ─────────────────────────────────────────────
function AlbumView({ album, isAdmin, onBack }) {
  const [photos, setPhotos]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ title:'', description:'', uploadedBy:'', tags:'' })
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl]     = useState(null)
  const [uploading, setUploading]       = useState(false)
  const [uploadError, setUploadError]   = useState('')
  const fileInputRef = useRef(null)

  const load = async () => {
    setLoading(true)
    try { const r = await getTogetherPhotosApi.getByAlbum(album.id); setPhotos(r.data) }
    catch { setPhotos([]) }
    setLoading(false)
  }
  useEffect(() => { load() }, [album.id])

  const handleFileChange = e => {
    const f = e.target.files[0]; if (!f) return
    if (!f.type.startsWith('image/')) { setUploadError('Please select an image.'); return }
    if (f.size > 10*1024*1024) { setUploadError('Max 10MB.'); return }
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
      await photoApi.create({ ...form, imageUrl, getTogetherId: album.id })
      resetForm(); load()
    } catch { setUploadError('Upload failed.') }
    finally { setUploading(false) }
  }
  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this photo?')) return
    try { await photoApi.delete(id); load() } catch {}
  }

  return (
    <div className="fade-in">
      {/* Back button + album header */}
      <div style={{marginBottom:24}}>
        <button className="btn-outline" style={{fontSize:13,marginBottom:18,display:'flex',alignItems:'center',gap:6}}
          onClick={onBack}>
          <ArrowLeft size={14}/> Back to Gallery
        </button>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div>
            <h2 className="page-title" style={{marginBottom:6}}>{album.title}</h2>
            <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
              {album.eventYear && <span style={{fontSize:13,color:'var(--ink-muted)',display:'flex',alignItems:'center',gap:5}}><Calendar size={13}/>{album.eventYear}</span>}
              {album.location  && <span style={{fontSize:13,color:'var(--ink-muted)',display:'flex',alignItems:'center',gap:5}}><MapPin size={13}/>{album.location}</span>}
              <span style={{fontSize:13,color:'var(--ink-muted)'}}>{photos.length} photo{photos.length!==1?'s':''}</span>
            </div>
            {album.description && <p style={{fontSize:13.5,color:'var(--ink)',fontStyle:'italic',marginTop:8,maxWidth:600}}>{album.description}</p>}
          </div>
          {isAdmin && (
            <button className="btn-primary" onClick={showForm ? resetForm : ()=>setShowForm(true)}>
              {showForm ? <><X size={13}/> Cancel</> : <><Plus size={13}/> Add Photo</>}
            </button>
          )}
        </div>
      </div>

      {/* Upload form */}
      {isAdmin && showForm && (
        <div className="gal-form-wrap">
          <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',marginBottom:14}}>
            ✦ Add Photo to "{album.title}"
          </div>
          <form onSubmit={handleSubmit}>
            <div className={`drop-zone${previewUrl?' has':''}`}
              onClick={()=>fileInputRef.current?.click()}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{e.preventDefault();handleFileChange({target:{files:e.dataTransfer.files}})}}>
              {previewUrl
                ? <><img src={previewUrl} style={{maxHeight:180,borderRadius:4,objectFit:'contain',marginBottom:8}}/><p style={{fontSize:12,color:'var(--ink-muted)'}}>Click to replace</p></>
                : <><div style={{fontSize:36,marginBottom:8}}>🖼️</div><p style={{fontWeight:600,color:'var(--ink)',marginBottom:4}}>Click or drag & drop</p><p style={{fontSize:12,color:'var(--ink-muted)'}}>JPG · PNG · max 10MB</p></>
              }
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFileChange}/>
            {uploadError && <p style={{color:'#b91c1c',fontSize:12,marginTop:8}}>{uploadError}</p>}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:14}}>
              {[
                {label:'Photo Title *',key:'title',full:true,required:true,placeholder:'e.g. Group dinner photo'},
                {label:'Your Name',key:'uploadedBy',placeholder:'Who shared this?'},
                {label:'Tags',key:'tags',placeholder:'e.g. dinner, group'},
                {label:'Description',key:'description',full:true,area:true,placeholder:'Caption for this photo…'},
              ].map(({label,key,placeholder,required,full,area})=>(
                <div key={key} style={full?{gridColumn:'1/-1'}:{}}>
                  <label className="form-label">{label}</label>
                  {area
                    ? <textarea className="input-field" style={{height:60}} placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>
                    : <input required={required} className="input-field" placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/>
                  }
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:10,marginTop:14}}>
              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? <><Loader2 size={13} style={{animation:'spin 1s linear infinite'}}/> Uploading…</> : <><Upload size={13}/> Upload</>}
              </button>
              <button type="button" className="btn-outline" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading
        ? <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading photos…</p></div>
        : photos.length===0
          ? <div className="empty-state"><div className="empty-icon">📷</div><p>No photos yet for this get-together.</p>{isAdmin&&<small>Be the first to add one!</small>}</div>
          : <div className="gallery-grid stagger">
              {photos.map(photo=>(
                <div key={photo.id} className="gallery-item" onClick={()=>setSelected(photo)}>
                  {isAdmin && (
                    <button className="gallery-del-btn" onClick={e=>handleDelete(photo.id,e)}>
                      <Trash2 size={11}/> Delete
                    </button>
                  )}
                  <img src={photo.imageUrl} alt={photo.title} style={{maxHeight:260}} onError={e=>e.target.style.display='none'}/>
                  <div className="gallery-caption">
                    <h3>{photo.title}</h3>
                    {photo.tags && (
                      <div style={{display:'flex',flexWrap:'wrap',gap:4,marginTop:4}}>
                        {photo.tags.split(',').map(t=>t.trim()).filter(Boolean).map(tag=>(
                          <span key={tag} className="gallery-tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                    {photo.uploadedBy && <p style={{fontSize:11,color:'var(--ink-muted)',marginTop:4,display:'flex',alignItems:'center',gap:3}}><User size={10}/>{photo.uploadedBy}</p>}
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

// ─────────────────────────────────────────────
// MAIN GALLERY PAGE
// ─────────────────────────────────────────────
export default function Gallery() {
  const { isAdmin } = useAuth()

  // Get-together albums
  const [albums, setAlbums]         = useState([])
  const [loadingAlbums, setLoadingAlbums] = useState(true)
  const [activeAlbum, setActiveAlbum]     = useState(null)

  // Album form
  const [showAlbumForm, setShowAlbumForm] = useState(false)
  const [editingAlbum, setEditingAlbum]   = useState(null)
  const [albumForm, setAlbumForm]         = useState({ title:'', description:'', location:'', eventYear:'' })
  const [albumCoverFile, setAlbumCoverFile]   = useState(null)
  const [albumCoverPreview, setAlbumCoverPreview] = useState(null)
  const [albumUploading, setAlbumUploading]   = useState(false)
  const [albumError, setAlbumError]           = useState('')
  const albumCoverRef = useRef(null)

  // General photos
  const [photos, setPhotos]       = useState([])
  const [loadingPhotos, setLoadingPhotos] = useState(true)
  const [selected, setSelected]   = useState(null)
  const [showPhotoForm, setShowPhotoForm] = useState(false)
  const [photoForm, setPhotoForm] = useState({ title:'', description:'', uploadedBy:'', tags:'' })
  const [photoFile, setPhotoFile]         = useState(null)
  const [photoPreview, setPhotoPreview]   = useState(null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoError, setPhotoError]         = useState('')
  const photoFileRef = useRef(null)

  const loadAlbums = async () => {
    setLoadingAlbums(true)
    try { const r = await getTogetherApi.getAll(); setAlbums(r.data) }
    catch { setAlbums([]) }
    setLoadingAlbums(false)
  }
  const loadPhotos = async () => {
    setLoadingPhotos(true)
    try { const r = await photoApi.getAll(); setPhotos(r.data) }
    catch { setPhotos([]) }
    setLoadingPhotos(false)
  }
  useEffect(() => { loadAlbums(); loadPhotos() }, [])

  // ── Album CRUD ──────────────────────────────────────────────────────
  const openAddAlbum  = () => { setEditingAlbum(null); setAlbumForm({title:'',description:'',location:'',eventYear:''}); setAlbumCoverFile(null); setAlbumCoverPreview(null); setAlbumError(''); setShowAlbumForm(true) }
  const openEditAlbum = a => { setEditingAlbum(a); setAlbumForm({title:a.title||'',description:a.description||'',location:a.location||'',eventYear:a.eventYear||''}); setAlbumCoverFile(null); setAlbumCoverPreview(a.coverImageUrl||null); setAlbumError(''); setShowAlbumForm(true) }
  const closeAlbumForm = () => { setShowAlbumForm(false); setEditingAlbum(null); setAlbumCoverFile(null); setAlbumCoverPreview(null); setAlbumError('') }

  const handleAlbumCoverChange = e => {
    const f = e.target.files[0]; if (!f) return
    if (!f.type.startsWith('image/')) { setAlbumError('Please select an image.'); return }
    setAlbumError(''); setAlbumCoverFile(f); setAlbumCoverPreview(URL.createObjectURL(f))
  }
  const handleAlbumSubmit = async e => {
    e.preventDefault(); setAlbumUploading(true)
    try {
      let coverImageUrl = editingAlbum?.coverImageUrl || ''
      if (albumCoverFile) coverImageUrl = await uploadPhoto(albumCoverFile)
      if (editingAlbum) await getTogetherApi.update(editingAlbum.id, { ...albumForm, coverImageUrl })
      else              await getTogetherApi.create({ ...albumForm, coverImageUrl })
      closeAlbumForm(); loadAlbums()
    } catch { setAlbumError('Failed to save. Please try again.') }
    finally { setAlbumUploading(false) }
  }
  const handleDeleteAlbum = async a => {
    if (!window.confirm(`Delete "${a.title}" and all its photos?`)) return
    try { await getTogetherApi.delete(a.id); loadAlbums() } catch {}
  }

  // ── General photo CRUD ──────────────────────────────────────────────
  const resetPhotoForm = () => { setShowPhotoForm(false); setPhotoForm({title:'',description:'',uploadedBy:'',tags:''}); setPhotoFile(null); setPhotoPreview(null); setPhotoError('') }
  const handlePhotoFileChange = e => {
    const f = e.target.files[0]; if (!f) return
    if (!f.type.startsWith('image/')) { setPhotoError('Please select an image.'); return }
    setPhotoError(''); setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f))
  }
  const handlePhotoSubmit = async e => {
    e.preventDefault()
    if (!photoFile) { setPhotoError('Please select a photo.'); return }
    setPhotoUploading(true)
    try {
      const imageUrl = await uploadPhoto(photoFile)
      await photoApi.create({ ...photoForm, imageUrl })
      resetPhotoForm(); loadPhotos()
    } catch { setPhotoError('Upload failed.') }
    finally { setPhotoUploading(false) }
  }
  const handleDeletePhoto = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this photo?')) return
    try { await photoApi.delete(id); loadPhotos() } catch {}
  }

  // ── If viewing an album, show AlbumView ────────────────────────────
  if (activeAlbum) {
    return <AlbumView album={activeAlbum} isAdmin={isAdmin} onBack={()=>setActiveAlbum(null)}/>
  }

  return (
    <div className="fade-in">
      <style>{`
        .gallery-grid { columns:1; gap:14px; }
        @media(min-width:500px){ .gallery-grid { columns:2; } }
        @media(min-width:900px){ .gallery-grid { columns:3; } }
        .gallery-item { break-inside:avoid; margin-bottom:14px; border-radius:4px; overflow:hidden;
          border:1px solid rgba(148,197,255,0.20); cursor:pointer; position:relative;
          box-shadow:0 2px 12px rgba(0,0,0,0.12); transition:transform 0.22s,box-shadow 0.22s; }
        .gallery-item:hover { transform:translateY(-3px); box-shadow:0 10px 24px rgba(100,60,10,0.18); }
        .gallery-item img { width:100%; display:block; object-fit:cover; background:#f5e6c8; }
        .gallery-caption { padding:12px 14px; background:#ffffff; }
        .gallery-caption h3 { font-family:'Libre Baskerville',serif;font-size:13.5px;font-weight:700;color:#0f172a;margin:0 0 4px; }
        .gallery-tag { font-size:10px;font-weight:600;padding:2px 8px;border-radius:2px;background:#eff6ff;color:#1d4ed8; }
        .gallery-del-btn { position:absolute;top:8px;right:8px;z-index:10;background:rgba(185,28,28,0.88);border:none;border-radius:4px;padding:6px 10px;color:white;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:4px;opacity:0;transition:opacity 0.18s; }
        .gallery-item:hover .gallery-del-btn { opacity:1; }

        /* Album cards */
        .album-card { background:#ffffff;border:1px solid rgba(148,197,255,0.20);border-radius:6px;overflow:hidden;
          box-shadow:0 3px 14px rgba(100,60,10,0.10);transition:transform 0.22s,box-shadow 0.22s;position:relative; }
        .album-card:hover { transform:translateY(-4px);box-shadow:0 12px 32px rgba(100,60,10,0.18); }
        .album-cover { width:100%;height:200px;object-fit:cover;display:block;background:linear-gradient(135deg,var(--parch),#e8d5a0); }
        .album-cover-placeholder { width:100%;height:200px;background:linear-gradient(135deg,#f5e9cc,#e8d5a0);display:flex;align-items:center;justify-content:center;font-size:48px; }
        .album-year-badge { position:absolute;top:12px;left:12px;background:var(--ink);color:var(--amber-light);font-family:'Libre Baskerville',serif;font-size:12px;font-weight:700;padding:4px 12px;border-radius:2px;letter-spacing:0.08em; }
        .album-body { padding:18px; }
        .album-title { font-family:'Libre Baskerville',serif;font-size:17px;font-weight:700;color:#0f172a;margin:0 0 6px; }
        .album-desc  { font-size:13px;color:#475569;line-height:1.65;margin:0 0 12px; }
        .album-meta  { display:flex;align-items:center;gap:12px;font-size:11.5px;color:#475569;margin-bottom:14px; }
        .album-more-btn { display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:3px;background:var(--ink);color:var(--amber-light);border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:600;transition:all 0.18s; }
        .album-more-btn:hover { background:#2c1a08; }
        .album-actions { display:flex;gap:6px;margin-top:10px; }
        .btn-edit { display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:3px;border:1.5px solid #93c5fd;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s; }
        .btn-edit:hover { background:#eff6ff; }
        .btn-del  { display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:3px;border:1.5px solid #fca5a5;background:#fef2f2;color:#b91c1c;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s; }
        .btn-del:hover  { background:#fee2e2; }

        /* Forms */
        .gal-form-wrap { background:#ffffff;border:1px solid rgba(148,197,255,0.20);border-radius:4px;padding:24px;margin-bottom:24px;box-shadow:0 4px 16px rgba(0,0,0,0.14);animation:slideDown 0.3s ease both; }
        .drop-zone { border:2px dashed #93c5fd;border-radius:4px;padding:28px 20px;text-align:center;cursor:pointer;transition:border-color 0.2s,background 0.2s;background:#f8fafc; }
        .drop-zone:hover,.drop-zone.has { border-color:#3b82f6;background:#fffbef; }
        .form-label { font-size:11px;font-weight:600;letter-spacing:0.10em;text-transform:uppercase;color:var(--sepia);display:block;margin-bottom:5px; }
        .section-divider { font-family:'Libre Baskerville',serif;font-style:italic;font-size:14px;color:var(--sepia);margin:32px 0 16px;display:flex;align-items:center;gap:12px; }
        .section-divider::after { content:'';flex:1;height:1px;background:#eff6ff; }

        /* Lightbox */
        .lightbox-overlay { position:fixed;inset:0;z-index:500;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease both; }
        .lightbox-inner { position:relative;max-width:820px;width:100%; }
        .lightbox-inner img { width:100%;border-radius:6px;object-fit:contain;max-height:72vh; }
        .lightbox-info { margin-top:14px;color:white; }
        .lightbox-close { position:absolute;top:-38px;right:0;background:rgba(255,255,255,0.12);border:none;border-radius:6px;padding:6px 12px;color:white;cursor:pointer;font-size:18px;line-height:1; }
      `}</style>

      <div className="page-header">
        <div>
          <h1 className="page-title">📸 Photo Gallery</h1>
          <p className="page-subtitle">Memories captured across 25 years — Class of 2000</p>
        </div>
        {isAdmin && (
          <div style={{display:'flex',gap:8}}>
            <button className="btn-outline" style={{fontSize:13}} onClick={showAlbumForm ? closeAlbumForm : openAddAlbum}>
              {showAlbumForm ? <><X size={13}/> Cancel</> : <><Plus size={13}/> Add Get-Together</>}
            </button>
            <button className="btn-primary" onClick={showPhotoForm ? resetPhotoForm : ()=>setShowPhotoForm(true)}>
              {showPhotoForm ? <><X size={13}/> Cancel</> : <><Plus size={13}/> Upload Photo</>}
            </button>
          </div>
        )}
      </div>

      {/* ── Add/Edit Get-Together form ─────────────────────────────── */}
      {isAdmin && showAlbumForm && (
        <div className="gal-form-wrap">
          <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:'1.15rem',fontWeight:700,color:'var(--ink)',marginBottom:16}}>
            ✦ {editingAlbum ? `Edit — ${editingAlbum.title}` : 'Add a Get-Together Album'}
          </div>
          <form onSubmit={handleAlbumSubmit}>
            {/* Cover image */}
            <div className={`drop-zone${albumCoverPreview?' has':''}`}
              onClick={()=>albumCoverRef.current?.click()}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{e.preventDefault();handleAlbumCoverChange({target:{files:e.dataTransfer.files}})}}>
              {albumCoverPreview
                ? <><img src={albumCoverPreview} style={{maxHeight:160,borderRadius:4,objectFit:'cover',marginBottom:8}}/><p style={{fontSize:12,color:'var(--ink-muted)'}}>Click to replace cover photo</p></>
                : <><div style={{fontSize:36,marginBottom:8}}>🎞️</div><p style={{fontWeight:600,color:'var(--ink)',marginBottom:4}}>Cover photo (optional)</p><p style={{fontSize:12,color:'var(--ink-muted)'}}>Click or drag & drop · JPG · PNG · max 10MB</p></>
              }
            </div>
            <input ref={albumCoverRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleAlbumCoverChange}/>
            {albumError && <p style={{color:'#b91c1c',fontSize:12,marginTop:8}}>{albumError}</p>}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:16}}>
              <div style={{gridColumn:'1/-1'}}>
                <label className="form-label">Album Title *</label>
                <input required className="input-field" placeholder="e.g. 1st Get-Together" value={albumForm.title} onChange={e=>setAlbumForm({...albumForm,title:e.target.value})}/>
              </div>
              <div>
                <label className="form-label">Year</label>
                <input className="input-field" placeholder="e.g. 2005" value={albumForm.eventYear} onChange={e=>setAlbumForm({...albumForm,eventYear:e.target.value})}/>
              </div>
              <div>
                <label className="form-label">Location</label>
                <input className="input-field" placeholder="e.g. Bangalore" value={albumForm.location} onChange={e=>setAlbumForm({...albumForm,location:e.target.value})}/>
              </div>
              <div style={{gridColumn:'1/-1'}}>
                <label className="form-label">Short Description</label>
                <textarea className="input-field" style={{height:72}} placeholder="A few words about this get-together…" value={albumForm.description} onChange={e=>setAlbumForm({...albumForm,description:e.target.value})}/>
              </div>
            </div>
            <div style={{display:'flex',gap:10,marginTop:16}}>
              <button type="submit" className="btn-primary" disabled={albumUploading}>
                {albumUploading ? <><Loader2 size={13} style={{animation:'spin 1s linear infinite'}}/> Saving…</> : editingAlbum ? '✓ Save Changes' : '✓ Create Album'}
              </button>
              <button type="button" className="btn-outline" onClick={closeAlbumForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ── GET-TOGETHER ALBUMS ────────────────────────────────────── */}
      {loadingAlbums
        ? <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading albums…</p></div>
        : albums.length > 0 && <>
            <div className="section-divider">🤝 Get-Together Albums</div>
            <div className="stagger" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:20,marginBottom:16}}>
              {albums.map(album=>(
                <div key={album.id} className="album-card">
                  {album.coverImageUrl
                    ? <img className="album-cover" src={album.coverImageUrl} alt={album.title} onError={e=>e.target.style.display='none'}/>
                    : <div className="album-cover-placeholder">📷</div>
                  }
                  {album.eventYear && <div className="album-year-badge">{album.eventYear}</div>}
                  <div className="album-body">
                    <h3 className="album-title">{album.title}</h3>
                    {album.description && <p className="album-desc">{album.description}</p>}
                    <div className="album-meta">
                      {album.location && <span style={{display:'flex',alignItems:'center',gap:4}}><MapPin size={11}/>{album.location}</span>}
                    </div>
                    <button className="album-more-btn" onClick={()=>setActiveAlbum(album)}>
                      View All Photos <ChevronRight size={14}/>
                    </button>
                    {isAdmin && (
                      <div className="album-actions">
                        <button className="btn-edit" onClick={()=>openEditAlbum(album)}><Pencil size={11}/> Edit</button>
                        <button className="btn-del"  onClick={()=>handleDeleteAlbum(album)}><Trash2 size={11}/> Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
      }

      {/* ── GENERAL PHOTOS ────────────────────────────────────────── */}
      <div className="section-divider">🖼️ General Photos</div>

      {/* General upload form */}
      {isAdmin && showPhotoForm && (
        <div className="gal-form-wrap">
          <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:'1.1rem',fontWeight:700,color:'var(--ink)',marginBottom:14}}>✦ Upload a Photo</div>
          <form onSubmit={handlePhotoSubmit}>
            <div className={`drop-zone${photoPreview?' has':''}`}
              onClick={()=>photoFileRef.current?.click()}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{e.preventDefault();handlePhotoFileChange({target:{files:e.dataTransfer.files}})}}>
              {photoPreview
                ? <><img src={photoPreview} style={{maxHeight:180,borderRadius:4,objectFit:'contain',marginBottom:8}}/><p style={{fontSize:12,color:'var(--ink-muted)'}}>Click to replace</p></>
                : <><div style={{fontSize:36,marginBottom:8}}>🖼️</div><p style={{fontWeight:600,color:'var(--ink)',marginBottom:4}}>Click or drag & drop</p><p style={{fontSize:12,color:'var(--ink-muted)'}}>JPG · PNG · max 10MB</p></>
              }
            </div>
            <input ref={photoFileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handlePhotoFileChange}/>
            {photoError && <p style={{color:'#b91c1c',fontSize:12,marginTop:8}}>{photoError}</p>}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:14}}>
              {[
                {label:'Photo Title *',key:'title',full:true,required:true,placeholder:'e.g. Sports Day 1999'},
                {label:'Your Name',key:'uploadedBy',placeholder:'Who shared this?'},
                {label:'Tags',key:'tags',placeholder:'e.g. sports, class-photo'},
                {label:'Description',key:'description',full:true,area:true,placeholder:'Tell the story behind this photo…'},
              ].map(({label,key,placeholder,required,full,area})=>(
                <div key={key} style={full?{gridColumn:'1/-1'}:{}}>
                  <label className="form-label">{label}</label>
                  {area
                    ? <textarea className="input-field" style={{height:64}} placeholder={placeholder} value={photoForm[key]} onChange={e=>setPhotoForm({...photoForm,[key]:e.target.value})}/>
                    : <input required={required} className="input-field" placeholder={placeholder} value={photoForm[key]} onChange={e=>setPhotoForm({...photoForm,[key]:e.target.value})}/>
                  }
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:10,marginTop:14}}>
              <button type="submit" className="btn-primary" disabled={photoUploading}>
                {photoUploading ? <><Loader2 size={13} style={{animation:'spin 1s linear infinite'}}/> Uploading…</> : <><Upload size={13}/> Upload Photo</>}
              </button>
              <button type="button" className="btn-outline" onClick={resetPhotoForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loadingPhotos
        ? <div className="empty-state"><div className="empty-icon">⏳</div><p>Loading photos…</p></div>
        : photos.length===0
          ? <div className="empty-state"><div className="empty-icon">📷</div><p>No general photos yet.</p>{isAdmin&&<small>Upload a memory!</small>}</div>
          : <div className="gallery-grid stagger">
              {photos.map(photo=>(
                <div key={photo.id} className="gallery-item" onClick={()=>setSelected(photo)}>
                  {isAdmin && (
                    <button className="gallery-del-btn" onClick={e=>handleDeletePhoto(photo.id,e)}>
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

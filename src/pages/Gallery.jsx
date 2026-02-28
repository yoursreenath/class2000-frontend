import { useEffect, useState, useRef } from 'react'
import { Plus, X, User, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import { photoApi, uploadPhoto } from '../api'


export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', uploadedBy: '', tags: '' })

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  const load = async () => {
    setLoading(true)
    const res = await photoApi.getAll()
    setPhotos(res.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, GIF, WEBP).')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB.')
      return
    }
    setUploadError('')
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.')
      return
    }
    setUploadError('')
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      setUploadError('Please select an image to upload.')
      return
    }
    setUploading(true)
    setUploadError('')
    try {
      const imageUrl = await uploadPhoto(selectedFile)
      await photoApi.create({ ...form, imageUrl })
      resetForm()
      load()
    } catch (err) {
      setUploadError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setForm({ title: '', description: '', uploadedBy: '', tags: '' })
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadError('')
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--ink)' }}>Photo Gallery</h1>
          <p style={{ color: 'var(--ink-muted)' }} className="mt-1">Memories we will never forget</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add Photo
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 relative">
          <button className="absolute top-4 right-4" onClick={resetForm} style={{ color: 'var(--ink-muted)' }}>
            <X size={18} />
          </button>
          <h3 className="font-display text-xl font-bold mb-5" style={{ color: 'var(--ink)' }}>Add a Memory</h3>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Drop Zone */}
            <div
              className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
              style={{ borderColor: previewUrl ? 'var(--amber)' : '#e8d9b5', background: previewUrl ? '#fffbeb' : '#fdf8f0' }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div>
                  <img src={previewUrl} alt="Preview" className="mx-auto rounded-lg object-contain" style={{ maxHeight: '220px', maxWidth: '100%' }} />
                  <div className="mt-3 flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--amber)' }}>
                    <Upload size={14} /><span>Click or drop to replace image</span>
                  </div>
                </div>
              ) : (
                <div className="py-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#fef3c7' }}>
                    <ImageIcon size={26} style={{ color: 'var(--amber)' }} />
                  </div>
                  <p className="font-semibold mb-1" style={{ color: 'var(--ink)' }}>Click to choose a photo</p>
                  <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>or drag and drop here</p>
                  <p className="text-xs mt-2" style={{ color: 'var(--ink-muted)' }}>JPG, PNG, GIF, WEBP — max 10MB</p>
                </div>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {uploadError && (
              <p className="text-sm px-3 py-2 rounded-lg" style={{ color: '#dc2626', background: '#fef2f2' }}>{uploadError}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required className="input-field md:col-span-2" placeholder="Photo Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <input className="input-field" placeholder="Your Name" value={form.uploadedBy} onChange={e => setForm({ ...form, uploadedBy: e.target.value })} />
              <input className="input-field" placeholder="Tags (e.g. sports, farewell)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              <textarea className="input-field md:col-span-2 h-20 resize-none" placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="flex gap-3 pt-1">
              <button type="submit" className="btn-primary flex items-center gap-2" disabled={uploading}>
                {uploading ? <><Loader2 size={15} className="animate-spin" /> Uploading...</> : <><Upload size={15} /> Upload Photo</>}
              </button>
              <button type="button" className="btn-outline" onClick={resetForm} disabled={uploading}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16" style={{ color: 'var(--ink-muted)' }}>Loading gallery...</div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'var(--ink-muted)' }}>
          <ImageIcon size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-display text-lg">No photos yet.</p>
          <p className="text-sm mt-1">Be the first to share a memory!</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {photos.map(photo => (
            <div key={photo.id} className="card overflow-hidden break-inside-avoid cursor-pointer" onClick={() => setSelected(photo)}>
              <img src={photo.imageUrl} alt={photo.title} className="w-full object-cover" style={{ maxHeight: '280px' }} onError={e => { e.target.style.display = 'none' }} />
              <div className="p-4">
                <h3 className="font-display text-base font-bold" style={{ color: 'var(--ink)' }}>{photo.title}</h3>
                {photo.description && <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>{photo.description}</p>}
                {photo.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {photo.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#fef3c7', color: 'var(--amber-dark)' }}>#{tag}</span>
                    ))}
                  </div>
                )}
                {photo.uploadedBy && (
                  <p className="flex items-center gap-1 text-xs mt-2" style={{ color: 'var(--amber)' }}>
                    <User size={11} /> {photo.uploadedBy}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={() => setSelected(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button className="absolute -top-10 right-0 text-white opacity-80 hover:opacity-100" onClick={() => setSelected(null)}><X size={26} /></button>
            <img src={selected.imageUrl} alt={selected.title} className="w-full rounded-xl object-contain" style={{ maxHeight: '70vh' }} />
            <div className="mt-3 text-white">
              <h3 className="font-display text-xl">{selected.title}</h3>
              {selected.description && <p className="text-sm opacity-70 mt-1">{selected.description}</p>}
              {selected.uploadedBy && <p className="flex items-center gap-1 text-sm mt-2 opacity-60"><User size={13} /> {selected.uploadedBy}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Plus, X, Tag, User } from 'lucide-react'
import { newsApi } from '../api'
import { format } from 'date-fns'

const categoryColors = {
  ANNOUNCEMENT: { bg: '#fef3c7', text: '#92400e' },
  MEMORY: { bg: '#e0f2fe', text: '#0369a1' },
  MILESTONE: { bg: '#dcfce7', text: '#166534' },
}

export default function NewsPage() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', author: '', category: 'ANNOUNCEMENT', imageUrl: '' })

  const load = async () => {
    setLoading(true)
    const res = await newsApi.getAll()
    setNews(res.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await newsApi.create(form)
    setShowForm(false)
    setForm({ title: '', content: '', author: '', category: 'ANNOUNCEMENT', imageUrl: '' })
    load()
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--ink)' }}>News & Updates</h1>
          <p style={{ color: 'var(--ink-muted)' }} className="mt-1">Milestones, memories & announcements</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Share News
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 relative">
          <button className="absolute top-4 right-4" onClick={() => setShowForm(false)} style={{ color: 'var(--ink-muted)' }}><X size={18} /></button>
          <h3 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--ink)' }}>Share a News Post</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required className="input-field" placeholder="Headline *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <input className="input-field" placeholder="Your Name" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="MEMORY">Memory</option>
                <option value="MILESTONE">Milestone</option>
              </select>
            </div>
            <input className="input-field" placeholder="Image URL (optional)" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
            <textarea required className="input-field h-28 resize-none" placeholder="Write your story..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Publish</button>
              <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16" style={{ color: 'var(--ink-muted)' }}>Loading news...</div>
      ) : (
        <div className="space-y-6">
          {news.map(item => {
            const colors = categoryColors[item.category] || categoryColors.ANNOUNCEMENT
            return (
              <div key={item.id} className="card overflow-hidden">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: colors.bg, color: colors.text }}>
                      {item.category}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                      {item.publishedAt ? format(new Date(item.publishedAt), 'dd MMM yyyy') : ''}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--ink)' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--ink)' }}>{item.content}</p>
                  {item.author && (
                    <p className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--ink-muted)' }}>
                      <User size={12} /> {item.author}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

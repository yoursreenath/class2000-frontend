import { useEffect, useState } from 'react'
import { Heart, MessageCircle, Plus, X, Send, ChevronDown, ChevronUp } from 'lucide-react'
import { discussionApi } from '../api'
import { formatDistanceToNow } from 'date-fns'

function PostCard({ post, onLike }) {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState({ author: '', content: '' })
  const [liked, setLiked] = useState(false)

  const loadComments = async () => {
    const res = await discussionApi.getComments(post.id)
    setComments(res.data)
  }

  useEffect(() => {
    if (showComments) loadComments()
  }, [showComments])

  const handleComment = async (e) => {
    e.preventDefault()
    await discussionApi.addComment(post.id, newComment)
    setNewComment({ author: '', content: '' })
    loadComments()
  }

  const handleLike = async () => {
    if (liked) return
    await onLike(post.id)
    setLiked(true)
  }

  return (
    <div className="card p-6">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white flex-shrink-0"
          style={{ background: 'var(--amber)' }}>
          {post.author?.[0] || '?'}
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{post.author}</p>
          <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
            {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : ''}
          </p>
        </div>
      </div>
      <h3 className="font-display text-lg font-bold mb-2" style={{ color: 'var(--ink)' }}>{post.title}</h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--ink)' }}>{post.content}</p>

      <div className="flex items-center gap-4 pt-3" style={{ borderTop: '1px solid #e8d9b5' }}>
        <button
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: liked ? '#ef4444' : 'var(--ink-muted)' }}
          onClick={handleLike}
        >
          <Heart size={14} fill={liked ? '#ef4444' : 'none'} /> {post.likes + (liked ? 1 : 0)}
        </button>
        <button
          className="flex items-center gap-1.5 text-sm"
          style={{ color: 'var(--ink-muted)' }}
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={14} /> Comments
          {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-3">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3 p-3 rounded-lg" style={{ background: '#fdf8f0' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: 'var(--amber)' }}>
                {c.author?.[0]}
              </div>
              <div>
                <p className="font-semibold text-xs" style={{ color: 'var(--ink)' }}>{c.author}</p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--ink)' }}>{c.content}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleComment} className="flex gap-2 mt-3">
            <input
              required
              className="input-field text-sm"
              placeholder="Your name"
              style={{ maxWidth: '130px' }}
              value={newComment.author}
              onChange={e => setNewComment({ ...newComment, author: e.target.value })}
            />
            <input
              required
              className="input-field text-sm flex-1"
              placeholder="Write a comment..."
              value={newComment.content}
              onChange={e => setNewComment({ ...newComment, content: e.target.value })}
            />
            <button type="submit" className="btn-primary px-3 py-2">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default function Discussion() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ author: '', title: '', content: '' })

  const load = async () => {
    setLoading(true)
    const res = await discussionApi.getAll()
    setPosts(res.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await discussionApi.create(form)
    setShowForm(false)
    setForm({ author: '', title: '', content: '' })
    load()
  }

  const handleLike = async (id) => {
    await discussionApi.like(id)
    load()
  }

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--ink)' }}>Discussion Board</h1>
          <p style={{ color: 'var(--ink-muted)' }} className="mt-1">Share stories, memories & stay in touch</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(true)}>
          <Plus size={16} /> New Post
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6 relative">
          <button className="absolute top-4 right-4" onClick={() => setShowForm(false)} style={{ color: 'var(--ink-muted)' }}><X size={18} /></button>
          <h3 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--ink)' }}>Start a Discussion</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required className="input-field" placeholder="Your Name *" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
            <input required className="input-field" placeholder="Post Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea required className="input-field h-28 resize-none" placeholder="What's on your mind?" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Post</button>
              <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16" style={{ color: 'var(--ink-muted)' }}>Loading discussions...</div>
      ) : (
        <div className="space-y-5">
          {posts.map(post => (
            <PostCard key={post.id} post={post} onLike={handleLike} />
          ))}
        </div>
      )}
    </div>
  )
}
